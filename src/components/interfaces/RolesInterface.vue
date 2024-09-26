<template>
  <CrudInterface
    v-model:form="form"
    model-name="Role"
    api-path="role"
    model-id-key="roleId"
    @create-opened="handleCreateOpened"
  >
    <template #form="{ crud }">
      <v-text-field
        ref="nameInput"
        v-model.trim="form.name"
        :disabled="crud.isWriting"
        :readonly="crud.isReadOnly"
        label="Name"
        :error-messages="crud.getErrors('name')"
      />
      <v-text-field
        v-model.trim="form.description"
        :disabled="crud.isWriting"
        :readonly="crud.isReadOnly"
        label="Description (optional)"
        :error-messages="crud.getErrors('description')"
      />
      <v-select
        v-model="form.permissions"
        :items="permissions"
        :disabled="crud.isWriting"
        :readonly="crud.isReadOnly"
        :label="form.permissions.length ? 'Permissions' : 'Permissions (none)'"
        multiple
      >
        <template #selection="data">
          <div v-if="data.index === 0">
            {{ form.permissions.length }}
            permission{{ form.permissions.length !== 1 ? 's' : '' }}
            assigned
          </div>
        </template>
      </v-select>
    </template>
    <template #list-row-prepend>
      <div class="mr-4">
        <v-icon
          icon="mdi-shield-account"
          size="x-large"
          color="secondary"
        />
      </div>
    </template>
    <template #list-row="{ row }: { row: ListRow }">
      <v-list-item-title>
        {{ row.name }}
      </v-list-item-title>
      <v-list-item-subtitle>
        {{ row.description }}
      </v-list-item-subtitle>
    </template>
  </CrudInterface>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import Permission, { permissionDescriptions } from '@/static/permission.js';

const nameInput = ref<HTMLInputElement | null>(null);

const handleCreateOpened = () => {
  nextTick(() => {
    nameInput.value?.focus();
  });
};

type ListRow = {
  name: string;
  description: string;
};

const form = ref({
  roleId: '',
  name: '',
  description: '',
  permissions: [],
});

const permissions = computed(() => {
  const items: Record<string, unknown>[] = [];
  Object.keys(Permission).forEach((item) => {
    items.push({
      value: item,
      title: permissionDescriptions[item],
    });
  });
  return items;
});
</script>
