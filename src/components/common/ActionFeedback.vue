<template>
  <v-snackbar
    v-model="isVisible"
    :color="color"
    close-on-content-click
  >
    {{ feedback }}
    <template #actions>
      <v-btn @click="isVisible = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
const isVisible = defineModel<boolean>();
withDefaults(defineProps<{
  feedback: string | null;
  color?: string;
}>(), {
  color: 'success',
});
</script>
