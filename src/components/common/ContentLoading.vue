<template>
  <div class="d-flex flex-column align-center">
    <v-progress-circular
      indeterminate
      color="primary"
      class="mb-2"
    />
    <span class="text-medium-emphasis font-italic">
      <slot />
    </span>
  </div>
</template>
