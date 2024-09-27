<template>
  <ActionDialog
    v-model="isVisible"
    :fullscreen="isFullscreen"
    width="600"
  >
    <template #title>
      <div>
        <div>
          Auditing {{ modelName }}
        </div>
        <div class="d-flex text-caption text-secondary mt-n1">
          Identifier: {{ modelId }}
          <v-tooltip location="start">
            <template #activator="{ props: tooltipProps }">
              <v-icon
                v-bind="tooltipProps"
                icon="mdi-help-circle-outline"
                class="ml-2 cursor-help"
              />
            </template>
            Each {{ modelName.toLowerCase() }} has its own unique identifier.
          </v-tooltip>
        </div>
      </div>
      <v-spacer />
      <v-btn
        v-if="!xs"
        variant="text"
        :icon="isFullscreen ? 'mdi-arrow-collapse-all' : 'mdi-arrow-expand-all'"
        @click.prevent="isFullscreen = !isFullscreen"
      />
      <v-btn
        variant="text"
        icon="mdi-close"
        @click.prevent="isVisible = false"
      />
    </template>
    <template #default>
      <ContentLoading v-if="isReading">
        Performing Audit
      </ContentLoading>
      <ServerError
        v-else-if="hasError"
        action-text="Retry Request"
        @click.prevent="readAudits"
      />
      <v-infinite-scroll
        v-else-if="!!audits.length"
        :items="audits"
        class="mt-n8"
        @load="readAudits"
      >
        <v-timeline side="end">
          <template
            v-for="(audit, index) in audits"
            :key="`audit-${index}`"
          >
            <v-timeline-item>
              <template #icon>
                <v-tooltip
                  :text="`${audit.firstName} ${audit.lastName}`"
                  location="end"
                >
                  <template #activator="{ props: tooltipProps }">
                    <v-avatar
                      v-bind="tooltipProps"
                      color="secondary"
                      :text="`${audit.firstName.charAt(0)}${audit.lastName.charAt(0)}`"
                      class="cursor-help"
                    />
                  </template>
                </v-tooltip>
              </template>
              <template #opposite>
                <v-layout class="flex-column text-caption align-end text-no-wrap">
                  <div>{{ datetimeToLocal(audit.timestamp).format('MMM D, YYYY') }}</div>
                  <div>{{ datetimeToLocal(audit.timestamp).format('h:mm A') }}</div>
                </v-layout>
              </template>
              <h4>
                {{ audit.message }}
              </h4>
            </v-timeline-item>
            <v-timeline-item
              v-if="audit.changes && audit.changes.length"
              hide-dot
            >
              <ul class="mt-n6 ml-n4">
                <li
                  v-for="(change, changeIndex) in audit.changes"
                  :key="`change-${changeIndex}`"
                  class="text-secondary text-caption mx-8"
                >
                  <template v-if="Array.isArray(change.before)">
                    <strong>{{ getFieldName(change.field) }}</strong> changed:
                    <ul
                      v-if="arrayDiff(change.before, change.after as string[])"
                      class="ml-4"
                    >
                      <li
                        v-for="(removed, removedIndex) in arrayDiff(change.before, change.after as string[])"
                        :key="`remove-${removedIndex}`"
                      >
                        Removed <strong>{{ formatArrayField(change.field, removed) }}</strong>
                      </li>
                    </ul>
                    <ul
                      v-if="arrayDiff(change.after as string[], change.before)"
                      class="ml-4"
                    >
                      <li
                        v-for="(added, addedIndex) in arrayDiff(change.after as string[], change.before)"
                        :key="`added-${addedIndex}`"
                      >
                        Added <strong>{{ formatArrayField(change.field, added) }}</strong>
                      </li>
                    </ul>
                  </template>
                  <template v-else>
                    <span class="text-no-wrap">
                      <strong>
                        {{ getFieldName(change.field) }}
                      </strong>
                      <template v-if="change.after === '' || change.after === null">
                        removed
                      </template>
                      <template v-else-if="change.before === '' || change.before === null">
                        added:
                        <ul style="list-style: none; min-width: 100px !important; word-break: break-all; white-space: wrap">
                          <li>
                            <span>{{ change.after }}</span>
                          </li>
                        </ul>
                      </template>
                      <template v-else>
                        changed:
                        <ul style="list-style: none; min-width: 100px !important; word-break: break-all; white-space: wrap">
                          <li>
                            <strong class="mr-1">From:</strong>
                            <span>{{ formatChangedValue(change.field, change.before as string) }}</span>
                          </li>
                          <li>
                            <strong class="mr-1">To:</strong>
                            <span>{{ formatChangedValue(change.field, change.after as string) }}</span>
                          </li>
                        </ul>
                      </template>
                    </span>
                  </template>
                </li>
              </ul>
            </v-timeline-item>
          </template>
        </v-timeline>
        <template #empty>
          <span class="text-medium-emphasis">End of audit</span>
        </template>
      </v-infinite-scroll>
      <v-empty-state
        v-else
        title="Audit returned no information"
        color="primary"
        image="/blank_canvas.svg"
      />
    </template>
  </ActionDialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useDisplay } from 'vuetify';
import api from '@/services/api.js';
import { datetimeToLocal } from '@/services/datetime.js';
import { permissionDescriptions } from '@/static/permission.js';
import fieldNames, { dateFields } from '@/static/fieldNames.js';

interface ModelChange {
  before: unknown;
  after: unknown;
  field: string;
}

interface ModelAudit {
  changes: ModelChange[] | null;
  firstName: string;
  lastName: string;
  message: string;
  timestamp: string;
}

const isVisible = defineModel<boolean>();

const props = defineProps<{
  modelName: string;
  modelId: string | null;
}>();

const { xs } = useDisplay();

const isFullscreen = ref(false);
const isReading = ref(true);
const hasError = ref(false);
const audits = ref<ModelAudit[]>([]);
const offset = ref(0);

type ScrollerOptions = {
  side: 'start' | 'end' | 'both';
  done: (status: 'loading' | 'error' | 'empty' | 'ok') => void;
};

const readAudits = async (options: ScrollerOptions = { side: 'both', done: () => undefined }) => {
  hasError.value = false;
  return api.get('/audit', {
    params: {
      modelType: props.modelName.replaceAll(' ', ''),
      modelId: props.modelId,
      offset: offset.value,
    },
  })
    .then((response) => {
      if (response.data.length) {
        audits.value.push(...response.data);
        offset.value += 20;
        options.done('ok');
      } else {
        options.done('empty');
      }
    })
    .catch(() => {
      hasError.value = true;
    })
    .finally(() => {
      isReading.value = false;
    });
};

const getFieldName = (field: string) => fieldNames[field] ?? field;

const arrayDiff = (array1: string[], array2: string[]) => array1.filter(
  (item) => !array2.includes(item),
);

const formatArrayField = (field: string, value: string) => {
  if (field === 'permissions') {
    return permissionDescriptions[value];
  }
  return value;
};

const formatChangedValue = (field: string, value: string) => {
  if (dateFields.indexOf(field) !== -1) {
    return datetimeToLocal(value).format('MMM D, YYYY h:mm A');
  }
  return value;
};

watch(() => isVisible.value, (newVal) => {
  isFullscreen.value = false;
  if (newVal) {
    isReading.value = true;
    readAudits();
  } else {
    setTimeout(() => {
      isReading.value = true;
      audits.value = [];
      offset.value = 0;
    }, 250);
  }
});
</script>
