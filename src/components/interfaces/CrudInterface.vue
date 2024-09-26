<template>
  <CrudForm
    v-model:is-visible="formIsVisible"
    v-model:form="form"
    :model-name="modelName"
    :api-path="apiPath"
    :model-id="modelId"
    @update-list="handleUpdateList"
    @create-opened="handleCreateOpened"
  >
    <template #default="{ crud }">
      <slot
        name="form"
        :crud="crud"
      />
    </template>
  </CrudForm>
  <CrudList
    :model-name="modelName"
    :api-path="apiPath"
    :model-id-key="modelIdKey"
    :update-count="listUpdateCount"
    :filter="filter"
    @show-form="handleShowForm"
  >
    <template #header-action-desktop="{ isLoading }">
      <slot
        name="list-header-action-desktop"
        :is-loading="isLoading"
      />
    </template>
    <template #header-action-mobile="{ isLoading }">
      <slot
        name="list-header-action-mobile"
        :is-loading="isLoading"
      />
    </template>
    <template #row-prepend="{ row }">
      <slot
        name="list-row-prepend"
        :row="row"
      />
    </template>
    <template #row="{ row }">
      <slot
        name="list-row"
        :row="row"
      />
    </template>
    <template #row-append="{ row }">
      <slot
        name="list-row-append"
        :row="row"
      />
    </template>
  </CrudList>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import useSession from '@/stores/session.js';

const session = useSession();

const form = defineModel<object>('form', { required: true });
const emit = defineEmits(['createOpened']);

withDefaults(defineProps<{
  modelName: string;
  apiPath: string;
  modelIdKey: string;
  filter?: (row: Record<string, unknown>) => boolean;
}>(), {
  filter: () => true,
});

const modelId = ref<string | null>(null);
const formIsVisible = ref(false);
const listUpdateCount = ref(0);

const handleShowForm = (id: string | null) => {
  modelId.value = id;
  formIsVisible.value = true;
};

const handleUpdateList = () => {
  listUpdateCount.value += 1;
  session.readSession();
};

const handleCreateOpened = () => {
  emit('createOpened', true);
};
</script>
