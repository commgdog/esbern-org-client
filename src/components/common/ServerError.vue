<template>
  <v-empty-state
    action-text="Refresh Page"
    :title="title"
    text="We're sorry, but something went wrong on our end. Please try again shortly."
    image="/server_down.svg"
  >
    <template #actions>
      <v-btn
        color="primary"
        prepend-icon="mdi-reload"
        @click.prevent="action"
      >
        {{ actionText }}
      </v-btn>
    </template>
  </v-empty-state>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  actionText?: string;
  title?: string;
  action?: () => void;
}>(), {
  actionText: 'Refresh Page',
  title: 'Server Error',
  action: () => document.location.reload(),
});
</script>
