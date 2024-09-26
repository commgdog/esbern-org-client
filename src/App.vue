<template>
  <v-responsive>
    <v-app>
      <OverlayNavigationDrawer v-if="showOverlay" />
      <OverlayAppBar v-if="showOverlay" />
      <v-main>
        <router-view />
      </v-main>
    </v-app>
  </v-responsive>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTheme } from 'vuetify';
import useOverlay from '@/stores/overlay.js';
import useSession from '@/stores/session.js';
import { watch } from 'vue';

const theme = useTheme();

const overlay = useOverlay();
const session = useSession();

const { showOverlay } = storeToRefs(overlay);
const { readCount, sessionData } = storeToRefs(session);

watch(readCount, () => {
  theme.global.name.value = sessionData.value.theme;
});
</script>
