<template>
  <LayoutCenter>
    <ActionDialog
      :model-value="true"
      opacity="0"
      width="350"
      persistent
      :form-submit="trySignIn"
    >
      <LayoutCenter class="flex-column mb-4">
        <v-img
          src="/sign_in.svg"
          width="250"
        />
        <h2 class="font-weight-medium">
          Sign In
        </h2>
      </LayoutCenter>
      <v-text-field
        ref="usernameInput"
        v-model="form.username"
        label="Username"
        :disabled="isLoading"
        :error="errors.username"
        required
      />
      <v-text-field
        ref="passwordInput"
        v-model="form.password"
        label="Password"
        :type="showPassword ? 'text' : 'password'"
        :disabled="isLoading"
        :error="errors.password"
        :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        required
        @click:append-inner="showPassword = !showPassword"
      />
      <v-alert
        v-if="passwordIsExpired"
        type="info"
        class="mb-4"
      >
        A password change is required
      </v-alert>
      <v-text-field
        v-if="passwordIsExpired"
        ref="newPasswordInput"
        v-model="form.newPassword1"
        label="New Password"
        :type="showNewPassword ? 'text' : 'password'"
        :disabled="isLoading"
        :error="errors.newPassword"
        :append-inner-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :required="passwordIsExpired"
        @click:append-inner="showNewPassword = !showNewPassword"
      />
      <v-text-field
        v-if="passwordIsExpired"
        v-model="form.newPassword2"
        label="Confirm New Password"
        :type="showNewPassword ? 'text' : 'password'"
        :disabled="isLoading"
        :error="errors.newPassword"
        :required="passwordIsExpired"
      />
      <v-alert
        v-if="errorMessage"
        type="error"
        class="mb-4"
      >
        {{ errorMessage }}
      </v-alert>
      <v-btn
        type="submit"
        color="primary"
        size="x-large"
        :loading="isLoading"
        block
      >
        Sign In
      </v-btn>
    </ActionDialog>
  </LayoutCenter>
</template>

<script setup lang="ts">
import { ref, onMounted, onUpdated, nextTick } from 'vue';
import { useTheme } from 'vuetify';
import api from '@/services/api.js';
import useSession from '@/stores/session.js';
import { useRouter } from 'vue-router';

const session = useSession();
const router = useRouter();

const usernameInput = ref<HTMLInputElement | null>(null);
const passwordInput = ref<HTMLInputElement | null>(null);
const newPasswordInput = ref<HTMLInputElement | null>(null);

const form = ref({
  username: '',
  password: '',
  newPassword1: '',
  newPassword2: '',
});

const errors = ref<Record<string, boolean>>({
  username: false,
  password: false,
  newPassword: false,
});

const isLoading = ref(false);
const showPassword = ref(false);
const showNewPassword = ref(false);
const passwordIsExpired = ref(false);
const errorMessage = ref('');

const resetErrors = () => {
  errorMessage.value = '';
  Object.keys(errors).forEach((key) => {
    errors.value[key] = false;
  });
};

const trySignIn = () => {
  isLoading.value = true;
  resetErrors();
  api.post('/session', form.value)
    .then(async (response) => {
      if (response.status === 202) {
        passwordIsExpired.value = true;
        isLoading.value = false;
        await nextTick();
        newPasswordInput.value?.focus();
        newPasswordInput.value?.select();
      } else {
        sessionStorage.setItem('lastToken', response.data.lastToken);
        api.defaults.headers.common.Authorization = `Bearer ${response.data.lastToken}`;
        session.setSession(response.data);
        await router.push(
          router.currentRoute.value.query.redirect?.toString()
          ?? `/${response.data.homePage}`,
        );
      }
    })
    .catch(async (error) => {
      if (error.response) {
        errorMessage.value = error.response.data.message;
        if (error.response.data.errors) {
          error.response.data.errors.forEach((field: string) => {
            errors.value[field] = true;
          });
        }
      } else {
        errorMessage.value = 'Internal server error';
      }
      isLoading.value = false;
      await nextTick();
      if (passwordIsExpired.value) {
        newPasswordInput.value?.focus();
        newPasswordInput.value?.select();
      } else if (!form.value.username) {
        usernameInput.value?.focus();
        usernameInput.value?.select();
      } else {
        passwordInput.value?.focus();
        passwordInput.value?.select();
      }
    });
};

const init = () => {
  const theme = useTheme();
  theme.global.name.value = 'light';
  api.delete('/session').then((response) => {
    session.setSession(response.data);
  }).finally(() => {
    sessionStorage.removeItem('lastToken');
    api.defaults.headers.common.Authorization = 'Bearer none';
  });
};

onUpdated(init);
onMounted(() => {
  init();
  nextTick(() => {
    usernameInput.value?.focus();
    usernameInput.value?.select();
  });
});
</script>
