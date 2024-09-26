<template>
  <v-card
    :loading="isLoading"
    :disabled="isLoading"
  >
    <v-card-title class="d-flex align-center">
      {{ filteredList.length }} {{ modelName }}{{ filteredList.length !== 1 ? 's' : '' }}
      <v-spacer />
      <slot
        v-if="!xs"
        name="header-action-desktop"
        :is-loading="isLoading"
      />
      <v-btn
        v-if="canCreate"
        color="primary"
        append-icon="mdi-plus"
        class="d-none d-sm-flex ml-4"
        @click.prevent="showForm(null)"
      >
        Create {{ modelName }}
      </v-btn>
      <v-menu v-if="xs && (canCreate || $slots['header-action-mobile'])">
        <template #activator="{ props: menuProps }">
          <v-btn
            v-bind="menuProps"
            icon="mdi-dots-vertical"
            variant="text"
            size="small"
            class="mr-n2"
          />
        </template>
        <v-list>
          <v-list-item
            v-if="canCreate"
            append-icon="mdi-plus"
            @click.prevent="showForm(null)"
          >
            <v-list-item-title>
              Create {{ modelName }}
            </v-list-item-title>
          </v-list-item>
          <slot
            name="header-action-mobile"
            :is-loading="isLoading"
          />
        </v-list>
      </v-menu>
    </v-card-title>
    <v-divider />
    <v-card-text v-if="!isInitialized">
      <h3 class="text-center font-italic">
        Loading {{ modelName }}s...
      </h3>
    </v-card-text>
    <ServerError v-else-if="hasError" />
    <v-card-text
      v-else-if="filteredList.length"
      class="pa-0"
    >
      <v-list class="py-0">
        <template
          v-for="(row, index) in filteredList"
          :key="`row-${index}`"
        >
          <v-list-item
            height="64"
            @click.prevent="showForm((row as any)[modelIdKey])"
          >
            <template #prepend>
              <slot
                name="row-prepend"
                :row="row"
              />
            </template>
            <slot
              name="row"
              :row="row"
            />
            <template #append>
              <slot
                name="row-append"
                :row="row"
              />
              <v-icon
                icon="mdi-chevron-right"
                class="ml-4"
              />
            </template>
          </v-list-item>
          <template v-if="index !== filteredList.length - 1">
            <v-divider :key="`divider-${index}`" />
          </template>
        </template>
      </v-list>
    </v-card-text>
    <v-empty-state
      v-else
      :title="`Looks like there are no ${modelName.toLowerCase()}s here yet`"
      :text="canCreate ? 'Let\'s get started by creating some!' : undefined"
      color="primary"
      image="/blank_canvas.svg"
    >
      <template
        v-if="canCreate"
        #actions
      >
        <v-btn
          color="primary"
          append-icon="mdi-plus"
          @click.prevent="showForm(null)"
        >
          Create {{ modelName }}
        </v-btn>
      </template>
    </v-empty-state>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useDisplay } from 'vuetify';
import api from '@/services/api.js';
import useSession from '@/stores/session.js';

const emit = defineEmits(['showForm']);

const props = withDefaults(defineProps<{
  modelName: string;
  modelIdKey: string;
  apiPath: string;
  updateCount: number;
  filter?: (row: Record<string, unknown>) => boolean;
}>(), {
  updateCount: 0,
  filter: () => true,
});

const { hasPermission } = useSession();
const canCreate = computed(() => hasPermission(`${props.modelName.toUpperCase().replaceAll(' ', '_')}_CREATE`));

const { xs } = useDisplay();

const isInitialized = ref(false);
const isLoading = ref(true);
const hasError = ref(false);
const list = ref([]);

const filteredList = computed(() => {
  return list.value.filter(props.filter);
});

const getList = async () => {
  isLoading.value = true;
  api.get(`/${props.apiPath}`)
    .then(({ data }) => {
      list.value = data;
    })
    .catch(async () => {
      hasError.value = true;
    })
    .finally(() => {
      isInitialized.value = true;
      isLoading.value = false;
    });
};

const showForm = (id: string | null) => {
  emit('showForm', id);
};

watch(() => props.updateCount, () => {
  getList();
});

onMounted(getList);
</script>
