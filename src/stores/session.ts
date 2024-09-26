import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import api from '@/services/api.js';

export default defineStore('session', () => {
  let controller = new AbortController();
  let redirectTimeout = undefined as undefined | NodeJS.Timeout;

  const readCount = ref(0);
  const isInitialized = ref(false);
  const isLoading = ref(false);
  const hasError = ref(false);

  const sessionData = ref({
    lastToken: null as string | null,
    tokenExpires: null as string | null,
    userId: null as string | null,
    username: null as string | null,
    email: null as string | null,
    firstName: null as string | null,
    lastName: null as string | null,
    passwordIsExpired: false,
    theme: 'light',
    homePage: 'dashboard',
    permissions: [] as string[],
    availableRoles: [] as string[],
    announcements: [] as Record<string, unknown>[],
  });

  const exists = computed(() => {
    return !!sessionData.value.userId;
  });
  const hasPermission = computed(() => {
    return (permission: string | null) => {
      return !permission || sessionData.value.permissions.indexOf(permission) !== -1;
    };
  });
  const userInitials = computed(() => {
    return `${sessionData.value.firstName?.charAt(0)}${sessionData.value.lastName?.charAt(0)}`;
  });
  const unreadAnnouncementCount = computed(() => {
    return sessionData.value.announcements.filter((announcement) => {
      return !announcement.isRead;
    }).length;
  });

  const setRedirectTimeout = () => {
    if (exists.value && sessionData.value.tokenExpires !== null) {
      const expiresTime = new Date(sessionData.value.tokenExpires).getTime();
      const currentTime = new Date().getTime();
      if (expiresTime > currentTime) {
        redirectTimeout = setTimeout(async () => {
          document.location.href = `/sign-in?redirect=${document.location.pathname}`;
        }, expiresTime - currentTime);
      } else {
        clearTimeout(redirectTimeout);
      }
    } else {
      clearTimeout(redirectTimeout);
    }
  };

  const setSession = (data: object) => {
    Object.assign(sessionData.value, data);
  };

  const readSession = async () => {
    controller.abort();
    controller = new AbortController();
    const timeout = setTimeout(() => {
      isLoading.value = true;
    }, 300);
    return api
      .get('/session', {
        signal: controller.signal,
      })
      .then((response) => {
        setSession(response.data);
        setRedirectTimeout();
        isInitialized.value = true;
        readCount.value += 1;
      })
      .catch(() => {
        hasError.value = true;
      })
      .finally(() => {
        clearTimeout(timeout);
        isLoading.value = false;
      });
  };

  const changeTheme = async (theme: string) => {
    controller.abort();
    controller = new AbortController();
    return api
      .post('/session/change-theme', { theme }, {
        signal: controller.signal,
      })
      .then(() => {
        sessionData.value.theme = theme;
      })
      .catch(() => {
        hasError.value = true;
      });
  };

  return {
    readCount,
    isInitialized,
    isLoading,
    hasError,
    sessionData,
    exists,
    hasPermission,
    userInitials,
    unreadAnnouncementCount,
    setRedirectTimeout,
    setSession,
    readSession,
    changeTheme,
  };
});
