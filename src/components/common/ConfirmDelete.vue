<template>
  <ActionDialog
    v-model="isVisible"
    width="350"
  >
    <template #title>
      Confirm Deletion
    </template>
    <template #default>
      <p class="mb-3 text-">
        Are you sure you want to delete this {{ modelName.toLowerCase() }}?
      </p>
      <v-alert
        class="mb-3"
        type="warning"
      >
        This action <strong>cannot</strong> be undone
      </v-alert>
      <v-text-field
        v-model="verification"
        label="Type 'delete' to confirm"
        hide-details
      />
    </template>
    <template #actions>
      <v-btn
        :disabled="isLoading"
        @click="isVisible = false"
      >
        Cancel
      </v-btn>
      <v-btn
        color="error"
        variant="flat"
        :disabled="!verified || isLoading"
        @click="runAction"
      >
        Confirm
      </v-btn>
    </template>
  </ActionDialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const isVisible = defineModel<boolean>();
const props = defineProps<{
  modelName: string;
  isLoading: boolean;
  action: () => void;
}>();
const verification = ref('');
const verified = computed(() => verification.value === 'delete');

const runAction = () => {
  if (verified.value) {
    props.action();
    isVisible.value = false;
  }
};

watch(isVisible, () => {
  verification.value = '';
});
</script>
