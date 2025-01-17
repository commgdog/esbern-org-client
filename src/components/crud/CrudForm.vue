<template>
  <ConfirmDelete
    v-model="confirmDeleteIsVisible"
    :model-name="modelName"
    :is-loading="publicState.isWriting"
    :action="runDelete"
  />
  <ConfirmCancel
    v-model="confirmCloseIsVisible"
    :action="cancelForm"
  />
  <ActionFeedback
    v-model="feedbackIsVisible"
    :feedback="feedbackMessage"
  />
  <ModelAuditor
    v-model="auditorIsVisible"
    :model-name="modelName"
    :model-id="modelId"
  />
  <ActionDialog
    v-model="isVisible"
    :persistent="hasUnsavedChanges"
  >
    <template
      v-if="isReady"
      #title
    >
      {{ publicState.isCreated ? 'Update' : 'Create' }} {{ modelName }}
      <v-tooltip
        v-if="hasUnsavedChanges"
        location="bottom"
      >
        <template #activator="{ props: tooltipProps }">
          <v-icon
            v-bind="tooltipProps"
            icon="mdi-alert-decagram-outline"
            size="x-small"
            class="text-warning cursor-help ml-2"
          />
        </template>
        <span>
          Unsaved Changes
        </span>
      </v-tooltip>
      <v-spacer />
      <v-menu v-if="showAdvancedMenu">
        <template #activator="{ props: menuProps }">
          <v-btn
            v-bind="menuProps"
            icon="mdi-dots-vertical"
            variant="text"
            size="small"
            class="my-n4"
          />
        </template>
        <v-list>
          <v-list-item
            v-if="hasPermission(Permission.AUDIT_READ)"
            append-icon="mdi-text-box-search-outline"
            @click.prevent="runAudit"
          >
            <v-list-item-title>
              Audit {{ modelName }}
            </v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="canDelete"
            append-icon="mdi-trash-can-outline"
            @click.prevent="confirmDelete"
          >
            <v-list-item-title>
              Delete {{ modelName }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn
        variant="text"
        icon="mdi-close"
        size="small"
        @click.prevent="confirmCancel"
      />
    </template>
    <template #default>
      <ContentLoading v-if="isReading">
        Loading {{ modelName }}
      </ContentLoading>
      <ServerError
        v-else-if="hasError"
        action-text="Retry Request"
        @click.prevent="runRead"
      />
      <slot
        v-else
        :crud="publicState"
      />
      <v-alert
        v-if="publicState.errorMessage"
        type="error"
      >
        {{ publicState.errorMessage }}
      </v-alert>
    </template>
    <template
      v-if="isReady"
      #actions
    >
      <v-btn
        :disabled="publicState.isWriting"
        @click.prevent="confirmCancel"
      >
        Cancel
      </v-btn>
      <v-btn
        v-if="canCreate || canUpdate"
        color="primary"
        variant="flat"
        :loading="publicState.isWriting"
        @click.prevent="submitForm"
      >
        {{ publicState.isCreated ? 'Update' : 'Create' }}
      </v-btn>
    </template>
  </ActionDialog>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import api, { parseErrorResponse } from '../../../../esbern-org-client/src/services/api.js';
import useSession from '../../../../esbern-org-client/src/stores/session.js';
import Permission from '../../../../esbern-org-client/src/static/permission.js';

const emit = defineEmits(['createOpened', 'updateList']);

const isVisible = defineModel<boolean>('isVisible', { required: true });
const form = defineModel<object>('form', { required: true });

export type FormTranslation = {
  from: (value: unknown) => unknown;
  to: (value: unknown) => unknown;
};

const props = withDefaults(defineProps<{
  modelName: string;
  apiPath: string;
  modelId: string | null;
  formTranslations?: Record<string, FormTranslation>;
}>(), {
  formTranslations: () => ({}),
});

const { hasPermission } = useSession();
const basePermissionName = props.modelName.toUpperCase().replaceAll(' ', '_');
const canCreate = computed(() => hasPermission(`${basePermissionName}_CREATE`));
const canUpdate = computed(() => hasPermission(`${basePermissionName}_UPDATE`));
const canDelete = computed(() => hasPermission(`${basePermissionName}_DELETE`));

const publicState = reactive({
  errors: [] as { field: string; message: string }[],
  isWriting: false,
  isCreated: computed(() => props.modelId !== null),
  isReadOnly: computed(() => props.modelId !== null && !canUpdate.value),
  errorMessage: '',
  getErrors: (field: string) => {
    return publicState.errors
      .filter((error) => error.field === field)
      .map((item) => item.message);
  },
});

const isReading = ref(true);
const hasError = ref(false);
const isReady = computed(() => !isReading.value && !hasError.value);

const feedbackMessage = ref('');
const feedbackIsVisible = ref(false);

const confirmCloseIsVisible = ref(false);
const confirmDeleteIsVisible = ref(false);
const auditorIsVisible = ref(false);

const hasUnsavedChanges = computed(() => {
  return JSON.stringify(formCache.value) !== JSON.stringify(form.value);
});

const showAdvancedMenu = computed(() => {
  return publicState.isCreated && (canDelete.value || hasPermission(Permission.AUDIT_READ));
});

const showFeedback = (message: string) => {
  feedbackMessage.value = message;
  feedbackIsVisible.value = true;
};

let formBase = {};
const formCache = ref({});

let controller = new AbortController();

const resetController = () => {
  controller.abort();
  controller = new AbortController();
};

const resetErrors = () => {
  publicState.errors = [];
  publicState.errorMessage = '';
};

const reset = () => {
  setTimeout(() => {
    resetErrors();
    Object.assign(form.value, formBase);
    publicState.isWriting = false;
    isReading.value = true;
    hasError.value = false;
    confirmCloseIsVisible.value = false;
    confirmDeleteIsVisible.value = false;
    Object.assign(formCache.value, formBase);
  }, 250);
};

const translateForm = (toTranslate: object, direction: 'from' | 'to') => {
  const formCopy: Record<string, unknown> = { ...toTranslate };
  const fieldsWithTranslation = Object.keys(props.formTranslations);
  Object.keys(formCopy).forEach((key) => {
    if (fieldsWithTranslation.indexOf(key) !== -1) {
      formCopy[key] = props.formTranslations[key][direction](formCopy[key]);
    }
  });
  return formCopy;
};

const runRead = () => {
  resetController();
  resetErrors();
  isReading.value = true;
  if (!publicState.isCreated) {
    isReading.value = false;
    emit('createOpened', true);
    return;
  }
  api.get(`/${props.apiPath}/${props.modelId}`, {
    signal: controller.signal,
  })
    .then((response) => {
      const translation = translateForm(response.data, 'from');
      Object.assign(form.value, translation);
      Object.assign(formCache.value, translation);
    })
    .catch(() => {
      hasError.value = true;
    })
    .finally(() => {
      isReading.value = false;
    });
};

const runCreate = () => {
  resetController();
  resetErrors();
  publicState.isWriting = true;
  api.post(`/${props.apiPath}`, translateForm(form.value, 'to'), {
    signal: controller.signal,
  })
    .then(() => {
      showFeedback(`${props.modelName} created!`);
      isVisible.value = false;
      emit('updateList');
    })
    .catch((err) => {
      if (err.response !== undefined && err.response.status === 400) {
        ({
          message: publicState.errorMessage,
          errors: publicState.errors,
        } = parseErrorResponse(err.response));
      } else {
        hasError.value = true;
      }
    })
    .finally(() => {
      publicState.isWriting = false;
    });
};

const runUpdate = () => {
  resetController();
  resetErrors();
  publicState.isWriting = true;
  api.patch(`/${props.apiPath}/${props.modelId}`, translateForm(form.value, 'to'), {
    signal: controller.signal,
  })
    .then(() => {
      showFeedback(`${props.modelName} updated!`);
      isVisible.value = false;
      emit('updateList');
    })
    .catch((err) => {
      if (err.response !== undefined && err.response.status === 400) {
        ({
          message: publicState.errorMessage,
          errors: publicState.errors,
        } = parseErrorResponse(err.response));
      } else {
        hasError.value = true;
      }
    })
    .finally(() => {
      publicState.isWriting = false;
    });
};

const runDelete = () => {
  resetController();
  resetErrors();
  publicState.isWriting = true;
  api.delete(`/${props.apiPath}/${props.modelId}`, {
    signal: controller.signal,
  })
    .then(() => {
      showFeedback(`${props.modelName} deleted!`);
      isVisible.value = false;
      emit('updateList');
    })
    .catch((err) => {
      if (err.response !== undefined && err.response.status === 400) {
        ({
          message: publicState.errorMessage,
          errors: publicState.errors,
        } = parseErrorResponse(err.response));
      } else {
        hasError.value = true;
      }
    })
    .finally(() => {
      publicState.isWriting = false;
    });
};

const runAudit = () => {
  auditorIsVisible.value = true;
};

const confirmDelete = () => {
  confirmDeleteIsVisible.value = true;
};

const confirmCancel = () => {
  if (hasUnsavedChanges.value) {
    confirmCloseIsVisible.value = true;
  } else {
    isVisible.value = false;
  }
};

const submitForm = () => {
  if (publicState.isCreated) {
    runUpdate();
  } else {
    runCreate();
  }
};

const cancelForm = () => {
  isVisible.value = false;
};

watch(isVisible, (newValue) => {
  if (newValue) {
    runRead();
  } else {
    reset();
  }
});

onMounted(() => {
  formBase = { ...form.value };
  formCache.value = { ...form.value };
});
</script>
