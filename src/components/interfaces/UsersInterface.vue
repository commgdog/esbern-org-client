<template>
  <CrudInterface
    v-model:form="form"
    model-name="User"
    api-path="user"
    model-id-key="userId"
    :filter="filter"
    @create-opened="handleCreateOpened"
  >
    <template #form="{ crud }">
      <v-text-field
        ref="usernameInput"
        v-model.trim="form.username"
        :disabled="crud.isWriting"
        :readonly="crud.isReadOnly"
        label="Username"
        :error-messages="crud.getErrors('username')"
      />
      <v-text-field
        v-model.trim="form.email"
        :disabled="crud.isWriting"
        :readonly="crud.isReadOnly"
        label="Email Address"
        :error-messages="crud.getErrors('email')"
      />
      <v-text-field
        v-model.trim="form.firstName"
        :disabled="crud.isWriting"
        :readonly="crud.isReadOnly"
        label="First Name"
        :error-messages="crud.getErrors('firstName')"
      />
      <v-text-field
        v-model.trim="form.lastName"
        :disabled="crud.isWriting"
        :readonly="crud.isReadOnly"
        label="Last Name"
        :error-messages="crud.getErrors('lastName')"
      />
      <v-select
        v-model="form.timezone"
        :items="timezones"
        :disabled="crud.isWriting"
        :readonly="crud.isReadOnly"
        label="Timezone"
      />
      <v-select
        v-model="form.theme"
        :items="themes"
        :disabled="crud.isWriting"
        :readonly="crud.isReadOnly"
        label="Theme"
      />
      <v-select
        v-model="form.homePage"
        :items="homePages"
        :disabled="crud.isWriting"
        :readonly="crud.isReadOnly"
        label="Home Page"
      />
      <v-checkbox
        v-model="form.isInactive"
        :disabled="crud.isWriting"
        :readonly="crud.isReadOnly"
        label="User is inactive (cannot login)"
      />
      <v-select
        v-model="form.roles"
        :items="session.availableRoles"
        :disabled="crud.isWriting"
        :readonly="crud.isReadOnly"
        :label="rolesLabel"
        multiple
      >
        <template #selection="data">
          <div v-if="data.index === 0">
            {{ form.roles.length }} role{{ form.roles.length !== 1 ? 's' : '' }} assigned
          </div>
        </template>
      </v-select>
      <v-checkbox
        v-if="crud.isCreated"
        v-model="showPassword"
        :disabled="crud.isWriting"
        :readonly="crud.isReadOnly"
        label="Change Password"
        hide-details
        :class="showPassword ? 'mb-4' : undefined"
      />
      <template v-if="showPassword || !crud.isCreated">
        <v-text-field
          v-model="form.password"
          type="password"
          :disabled="crud.isWriting"
          :readonly="crud.isReadOnly"
          label="Password"
          :error-messages="crud.getErrors('password')"
        />
        <v-text-field
          v-model="form.passwordConfirm"
          type="password"
          :disabled="crud.isWriting"
          :readonly="crud.isReadOnly"
          label="Confirm Password"
          :error-messages="crud.getErrors('passwordConfirm')"
        />
      </template>
      <v-checkbox
        v-model="form.passwordIsExpired"
        :disabled="crud.isWriting"
        :readonly="crud.isReadOnly"
        hide-details
        label="Require password change at login"
      />
    </template>
    <template #list-header-action-desktop>
      <v-checkbox
        v-model="includeInactive"
        label="Include Inactive"
        hide-details
        density="compact"
      />
    </template>
    <template #list-header-action-mobile>
      <v-list-item
        :append-icon="includeInactive ? 'mdi-sleep' : 'mdi-sleep-off'"
        @click="includeInactive = !includeInactive"
      >
        <v-list-item-title>
          {{ includeInactive ? 'Hide' : 'Include' }} Inactive
        </v-list-item-title>
      </v-list-item>
    </template>
    <template #list-row-prepend="{ row }: { row: ListRow }">
      <v-avatar color="secondary">
        {{ row.firstName.charAt(0) }}{{ row.lastName.charAt(0) }}
      </v-avatar>
    </template>
    <template #list-row="{ row }: { row: ListRow }">
      <v-list-item-title>
        {{ row.firstName }} {{ row.lastName }} &mdash;
        <span class="text-secondary font-italic">
          {{ row.username }}
        </span>
      </v-list-item-title>
      <v-list-item-subtitle>
        {{ row.email }}
      </v-list-item-subtitle>
    </template>
    <template #list-row-append="{ row }: { row: ListRow }">
      <v-chip
        v-if="row.isInactive"
        size="small"
        color="warning"
        class="ml-2"
      >
        Inactive
      </v-chip>
      <v-chip
        v-if="row.hasActiveSession"
        size="small"
        color="success"
        class="ml-2 d-none d-sm-flex"
      >
        Online Now
      </v-chip>
    </template>
  </CrudInterface>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import useSession from '@/stores/session.js';
import { storeToRefs } from 'pinia';
import { timezones } from '@/static/timezones.js';
import themes from '@/static/themes.js';
import homePages from '@/static/homePages.js';

const { sessionData: session } = storeToRefs(useSession());

const includeInactive = ref(false);
const showPassword = ref(false);

const usernameInput = ref<HTMLInputElement | null>(null);

const handleCreateOpened = () => {
  nextTick(() => {
    usernameInput.value?.focus();
  });
};

type ListRow = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  isInactive: boolean;
  hasActiveSession: boolean;
};

const form = ref({
  userId: '',
  username: '',
  email: '',
  password: null,
  passwordConfirm: null,
  passwordIsExpired: false,
  firstName: '',
  lastName: '',
  timezone: 'UTC',
  theme: 'light',
  homePage: 'dashboard',
  isInactive: false,
  roles: [],
});

const filter = computed(() => {
  return (row: Record<string, unknown>) => {
    if (!includeInactive.value) {
      return !row.isInactive;
    }
    return true;
  };
});

const rolesLabel = computed(() => {
  if (form.value.roles.length === 0) {
    return 'Roles (none)';
  }
  return 'Roles';
});

watch(showPassword, () => {
  form.value.password = null;
  form.value.passwordConfirm = null;
});
</script>
