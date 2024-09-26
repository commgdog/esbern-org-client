<template>
  <ActionDialog
    v-model="isVisible"
    width="350"
  >
    <template #title>
      Confirm Cancel
    </template>
    <template #default>
      <p class="mb-4">
        Are you sure you want to cancel?
      </p>
      <v-alert type="warning">
        Unsaved changes will be lost
      </v-alert>
    </template>
    <template #actions>
      <v-btn @click="isVisible = false">
        Back
      </v-btn>
      <v-btn
        color="warning"
        variant="flat"
        @click="runAction"
      >
        Confirm
      </v-btn>
    </template>
  </ActionDialog>
</template>

<script setup lang="ts">
const isVisible = defineModel<boolean>();
const props = defineProps<{
  action: () => void;
}>();

const runAction = () => {
  props.action();
  isVisible.value = false;
};
</script>
