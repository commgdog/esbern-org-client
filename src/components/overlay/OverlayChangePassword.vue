<template>
  <v-snackbar
    :model-value="snackbarValue"
    color="success"
    close-on-content-click
  >
    Password changed successfully.
    <template #actions>
      <v-btn
        variant="text"
        @click="snackbarValue = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
  <ActionDialog
    v-model="modelValue"
    width="350"
    :form-submit="changePassword"
    @update:model-value="reset"
  >
    <template #activator="{ props }">
      <slot
        name="activator"
        :props="props"
      />
    </template>
    <template #title>
      Change your password
    </template>
    <template #default>
      <v-text-field
        ref="currentPasswordInput"
        v-model="form.currentPassword"
        label="Enter your current password"
        :type="showCurrentPassword ? 'text' : 'password'"
        :error="errors.currentPassword"
        :disabled="isLoading"
        :append-inner-icon="showCurrentPassword ? 'mdi-eye' : 'mdi-eye-off'"
        required
        @click:append-inner="showCurrentPassword = !showCurrentPassword"
      />
      <v-text-field
        ref="passwordInput"
        v-model="form.password"
        label="Enter your new password"
        type="password"
        :error="errors.password"
        :disabled="isLoading"
        required
      />
      <v-text-field
        v-model="form.passwordConfirm"
        label="Confirm your new password"
        type="password"
        :error="errors.passwordConfirm"
        :disabled="isLoading"
        required
      />
      <v-alert
        v-if="errorMessage"
        class="mt-4"
        type="error"
      >
        {{ errorMessage }}
      </v-alert>
    </template>
    <template #actions>
      <v-spacer />
      <v-btn
        variant="text"
        @click="modelValue = false"
      >
        Cancel
      </v-btn>
      <v-btn
        type="submit"
        color="primary"
        variant="flat"
      >
        Save
      </v-btn>
    </template>
  </ActionDialog>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import api from '@/services/api.js';

const modelValue = ref(false);

const snackbarValue = ref(false);

const currentPasswordInput = ref<HTMLInputElement | null>(null);
const passwordInput = ref<HTMLInputElement | null>(null);

const isLoading = ref(false);

const showCurrentPassword = ref(false);

const form = ref<Record<string, string>>({
  currentPassword: '',
  password: '',
  passwordConfirm: '',
});

const errorMessage = ref('');
const errors = ref<Record<string, boolean>>({
  currentPassword: false,
  password: false,
  passwordConfirm: false,
});

watch(currentPasswordInput, async (newValue) => {
  if (newValue !== null) {
    setTimeout(() => {
      currentPasswordInput.value?.focus();
      currentPasswordInput.value?.select();
    }, 100);
  }
});

const resetErrors = () => {
  Object.keys(errors.value).forEach((key) => {
    errors.value[key] = false;
  });
};

const reset = async () => {
  isLoading.value = false;
  snackbarValue.value = false;
  errorMessage.value = '';
  showCurrentPassword.value = false;
  Object.keys(form.value).forEach((key) => {
    form.value[key] = '';
  });
  resetErrors();
};

const changePassword = async () => {
  resetErrors();
  isLoading.value = true;
  api.post('/session/change-password', form.value)
    .then(() => {
      modelValue.value = false;
      snackbarValue.value = true;
    })
    .catch(async (err) => {
      isLoading.value = false;
      if (err.response.status === 400) {
        errorMessage.value = err.response.data.message;
        err.response.data.errorFields.forEach((key: string) => {
          errors.value[key] = true;
        });
        await nextTick();
        switch (err.response.data.errorFields[0]) {
          case 'password':
            passwordInput.value?.focus();
            passwordInput.value?.select();
            break;
          default:
            currentPasswordInput.value?.focus();
            currentPasswordInput.value?.select();
        }
      } else if (err.response) {
        errorMessage.value = err.response.data.message;
      } else {
        errorMessage.value = 'Internal server error';
      }
    });
};
</script>
