<template>
  <v-dialog
    v-model="isVisible"
    :fullscreen="xs || fullscreen"
    :width="!xs && !fullscreen ? width : undefined"
    :persistent="persistent"
    :opacity="opacity"
    scrollable
  >
    <template #activator="{ props }">
      <slot
        name="activator"
        :props="props"
      />
    </template>
    <v-card>
      <v-card-title
        v-if="$slots.title"
        class="d-flex align-center py-2"
      >
        <slot name="title" />
      </v-card-title>
      <v-divider />
      <v-card-text :class="noTextPadding ? 'pa-0' : 'pa-4'">
        <v-form @submit.prevent="formSubmit">
          <slot />
        </v-form>
      </v-card-text>
      <v-divider v-if="$slots.actions" />
      <v-card-actions
        v-if="$slots.actions"
        class="px-4"
      >
        <v-spacer />
        <slot name="actions" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify';

const isVisible = defineModel<boolean>();

const { xs } = useDisplay();

withDefaults(defineProps<{
  persistent?: boolean;
  fullscreen?: boolean;
  noTextPadding?: boolean;
  width?: string;
  opacity?: string | number;
  formSubmit?: () => void;
}>(), {
  persistent: false,
  fullscreen: false,
  noTextPadding: false,
  width: '400px',
  opacity: undefined,
  formSubmit: () => undefined,
});
</script>
