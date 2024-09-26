<template>
  <v-container
    fluid
    max-width="800"
    class="ma-0"
  >
    <template v-if="!isExactActive && filteredCategories.length > 0">
      <v-card
        v-for="(category, index) in filteredCategories"
        :key="`category-${index}`"
        :to="{ name: category.path }"
        :title="category.title"
        :subtitle="category.subtitle"
        class="mb-2"
      >
        <template #prepend>
          <v-icon
            :icon="category.icon"
            color="secondary"
            size="38"
            class="mr-2"
          />
        </template>
        <template #append>
          <v-icon
            icon="mdi-chevron-right"
            color="secondary"
            size="24"
          />
        </template>
      </v-card>
    </template>
    <v-alert
      v-else-if="!isExactActive"
      text="Your account does not have permission to modify settings"
      title="Permission Required"
      type="warning"
      border="start"
      variant="tonal"
    />
    <router-view />
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, onUpdated, ref } from 'vue';
import { useRoute } from 'vue-router';
import useSession from '@/stores/session.js';
import Permission from '@/static/permission.js';

const session = useSession();

const route = useRoute();

const categories = [
  {
    title: 'Users',
    path: 'settings-users',
    subtitle: 'Manage user accounts',
    permission: Permission.USER_READ,
    icon: 'mdi-account-multiple',
  },
  {
    title: 'Roles',
    path: 'settings-roles',
    subtitle: 'Manage roles and permissions',
    permission: Permission.ROLE_READ,
    icon: 'mdi-shield-account',
  },
];

const filteredCategories = ref(
  categories.filter((category) => session.hasPermission(category.permission)),
);

const isExactActive = ref(false);

onMounted(() => {
  isExactActive.value = route.name !== 'settings';
});
onUpdated(() => {
  isExactActive.value = route.name !== 'settings';
});
</script>
