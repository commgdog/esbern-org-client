<template>
  <v-navigation-drawer
    v-model="showNavigation"
    color="navigation"
  >
    <div
      class="d-inline-flex align-center cursor-pointer pa-3"
      @click.prevent="goToHomePage"
    >
      <v-img
        src="/favicon.ico"
        width="32"
        height="32"
        class="esbern-spinner"
      />
      <div class="ml-7 font-weight-medium">
        esbern<span class="text-success">.org</span>
      </div>
    </div>
    <v-list nav>
      <v-list-item
        link
        :to="{ name: 'dashboard' }"
        title="Dashboard"
        prepend-icon="mdi-view-dashboard-outline"
      />
      <v-list-item
        link
        :to="{ name: 'announcements' }"
        title="Announcements"
        prepend-icon="mdi-bullhorn-outline"
      />
      <v-list-item
        v-if="hasPermission(Permission.SETTINGS_READ)"
        link
        :to="{ name: 'settings' }"
        title="Settings"
        prepend-icon="mdi-cog-outline"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import useOverlay from '@/stores/overlay.js';
import useSession from '@/stores/session.js';
import Permission from '@/static/permission.js';
import { useRouter } from 'vue-router';

const overlay = useOverlay();
const session = useSession();

const { hasPermission } = session;
const { showNavigation } = storeToRefs(overlay);

const router = useRouter();

const goToHomePage = () => {
  router.push(session.sessionData.homePage);
};
</script>

<style>
.esbern-spinner:hover {
  animation: rotation 0.5s infinite linear
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>
