<template>
  <v-app-bar
    density="comfortable"
    elevation="0"
    class="border-b"
    height="58"
  >
    <v-app-bar-nav-icon
      class="d-lg-none"
      @click.stop="showNavigation = !showNavigation"
    />
    <v-breadcrumbs :items="breadcrumbs">
      <template #title="{ item }">
        <span class="font-weight-medium">
          {{ item.title }}
        </span>
      </template>
    </v-breadcrumbs>
    <template #append>
      <OverlayAnnouncements />
      <OverlayUserMenu />
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import useOverlay from '@/stores/overlay.js';

const overlay = useOverlay();

const { showNavigation } = storeToRefs(overlay);

const route = useRoute();

interface BreadcrumbItem {
  title: string;
  disabled: boolean;
  to: string;
}

const breadcrumbs = computed(() => {
  const items: BreadcrumbItem[] = [];
  route.matched.forEach((matched) => {
    items.push({
      title: matched.meta.title as string,
      disabled: false,
      to: matched.path,
    });
  });
  return items;
});
</script>
