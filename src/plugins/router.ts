import { createRouter, createWebHistory, RouteLocation } from 'vue-router';
import useSession from '@/stores/session.js';
import Permission from '@/static/permission.js';
import LandingPage from '@/pages/LandingPage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: 'landing',
      path: '/',
      component: LandingPage,
      meta: {
        title: 'Grant Martin',
        isPublic: true,
      },
    },
    {
      name: 'sign-in',
      path: '/sign-in',
      alias: '/login',
      meta: {
        title: 'Sign In',
        isPublic: true,
      },
      component: () => import('@/pages/SignInPage.vue'),
    },
    {
      name: 'dashboard',
      path: '/dashboard',
      meta: {
        title: 'Dashboard',
        showOverlay: true,
      },
      component: () => import('@/pages/DashboardPage.vue'),
    },
    {
      name: 'announcements',
      path: '/announcements',
      meta: {
        title: 'Announcements',
        showOverlay: true,
      },
      component: () => import('@/pages/AnnouncementsPage.vue'),
    },
    {
      name: 'settings',
      path: '/settings',
      meta: {
        title: 'Settings',
        permission: Permission.SETTINGS_READ,
        showOverlay: true,
      },
      component: () => import('@/pages/SettingsPage.vue'),
      children: [
        {
          name: 'settings-users',
          path: 'users',
          meta: {
            title: 'Users',
            permission: Permission.USER_READ,
            showOverlay: true,
          },
          component: () => import('@/pages/SettingsUsersPage.vue'),
        },
        {
          name: 'settings-roles',
          path: 'roles',
          meta: {
            title: 'Roles',
            permission: Permission.ROLE_READ,
            showOverlay: true,
          },
          component: () => import('@/pages/SettingsRolesPage.vue'),
        },
      ],
    },
    {
      name: 'not-found',
      path: '/:pathMatch(.*)*',
      meta: {
        title: 'Page not found',
        isPublic: true,
      },
      component: () => import('@/pages/NotFoundPage.vue'),
    },
  ],
});

const DEFAULT_TITLE = 'esbern.org';

router.beforeEach(async (to: RouteLocation) => {
  const { isPublic, permission } = to.meta;

  // Public route check
  if (isPublic) {
    return true;
  }

  // Session check
  const session = useSession();
  await session.readSession();
  if (!session.exists) {
    return {
      name: 'sign-in',
      query: {
        redirect: to.fullPath,
      },
    };
  }

  // Permission check
  if (session.exists && !session.hasPermission(permission as string | null)) {
    return 'sign-in';
  }

  // All checks passed
  return true;
});

router.afterEach((to: RouteLocation) => {
  const session = useSession();
  session.isLoading = false;
  document.title = <string>to.meta.title || DEFAULT_TITLE;
});

export default router;
