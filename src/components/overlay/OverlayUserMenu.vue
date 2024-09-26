<template>
  <v-menu>
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        icon
        class="ml-2"
      >
        <v-avatar color="secondary">
          {{ userInitials }}
        </v-avatar>
      </v-btn>
    </template>
    <v-card>
      <v-card-text class="pa-0">
        <div class="mx-auto text-center pa-4">
          <v-avatar
            color="secondary"
            :text="userInitials ?? ''"
          />
          <h3>{{ displayName }}</h3>
          <p class="text-caption">
            {{ sessionData.email }}
          </p>
        </div>
        <v-divider />
        <v-list>
          <v-list-item
            append-icon="mdi-theme-light-dark"
            @click="toggleTheme"
          >
            <v-list-item-title>
              Enable {{ theme.global.name.value === 'dark' ? 'Light' : 'Dark' }} Theme
            </v-list-item-title>
          </v-list-item>
          <OverlayChangePassword>
            <template #activator="{ props }">
              <v-list-item
                append-icon="mdi-lock-reset"
                v-bind="props"
              >
                <v-list-item-title>
                  Change Password
                </v-list-item-title>
              </v-list-item>
            </template>
          </OverlayChangePassword>
          <v-list-item
            append-icon="mdi-logout"
            :to="{ name: 'sign-in' }"
          >
            <v-list-item-title>
              Sign Out
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useTheme } from 'vuetify';
import useSession from '@/stores/session.js';

const session = useSession();

const { userInitials, sessionData } = storeToRefs(session);

const theme = useTheme();

const displayName = computed(() => {
  if (sessionData.value.firstName && sessionData.value.lastName) {
    return `${sessionData.value.firstName} ${sessionData.value.lastName}`;
  } else if (sessionData.value.firstName) {
    return sessionData.value.firstName;
  }
  return sessionData.value.username;
});

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark
    ? 'light'
    : 'dark';
  session.changeTheme(theme.global.name.value);
}
</script>
