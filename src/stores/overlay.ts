import { defineStore } from 'pinia';
import { useDisplay } from 'vuetify';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

export default defineStore('overlay', () => {
  const { mobile } = useDisplay();

  const route = useRoute();

  const showOverlay = ref(false);
  const showNavigation = ref(!mobile.value);

  watch(route, (newRoute) => {
    showOverlay.value = !!newRoute.meta.showOverlay;
  });

  return {
    showOverlay,
    showNavigation,
  };
});
