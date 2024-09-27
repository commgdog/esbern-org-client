<template>
  <CrudInterface
    v-model:form="form"
    model-name="Announcement"
    api-path="announcement"
    model-id-key="announcementId"
    :form-translations="formTranslations"
  >
    <template #form="{ crud }">
      <v-alert
        v-if="datetime().isAfter(form.expiresAt)"
        class="mb-4"
        type="warning"
      >
        This announcement is expired
      </v-alert>
      <v-text-field
        v-model="form.announceAt"
        type="datetime-local"
        :disabled="crud.isWriting"
        :readonly="crud.isReadOnly"
        label="Announce At"
        :error-messages="crud.getErrors('announceAt')"
      >
        <template #append-inner>
          <v-btn
            size="small"
            color="primary"
            variant="text"
            @click.prevent="setAnnounceAtNow"
          >
            Now
          </v-btn>
        </template>
      </v-text-field>
      <v-text-field
        v-model="form.expiresAt"
        type="datetime-local"
        :disabled="crud.isWriting"
        :readonly="crud.isReadOnly"
        label="Expires At"
        :error-messages="crud.getErrors('expiresAt')"
      >
        <template #append-inner>
          <v-btn
            size="small"
            color="primary"
            variant="text"
            @click.prevent="setExpiresAtEod"
          >
            EOD
          </v-btn>
        </template>
      </v-text-field>
      <v-text-field
        v-model.trim="form.title"
        :disabled="crud.isWriting"
        :readonly="crud.isReadOnly"
        label="Title"
        :error-messages="crud.getErrors('title')"
      />
      <v-textarea
        v-model.trim="form.body"
        :disabled="crud.isWriting"
        :readonly="crud.isReadOnly"
        label="Body"
        :error-messages="crud.getErrors('body')"
      />
    </template>
    <template #list-row-prepend>
      <div class="mr-4">
        <v-icon
          icon="mdi-bullhorn-outline"
          size="x-large"
          color="secondary"
        />
      </div>
    </template>
    <template #list-row="{ row }: { row: ListRow}">
      <v-list-item-title>
        {{ row.title }}
      </v-list-item-title>
      <v-list-item-subtitle>
        Shown from
        {{ datetimeToLocal(row.announceAt).format('M/D/YY') }}
        to
        {{ datetimeToLocal(row.expiresAt).format('M/D/YY') }}
      </v-list-item-subtitle>
    </template>
    <template #list-row-append="{ row }: { row: ListRow }">
      <v-chip
        v-if="datetime().isAfter(row.expiresAt)"
        size="small"
        color="warning"
        class="ml-2"
      >
        Expired
      </v-chip>
    </template>
  </CrudInterface>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import datetime, { datetimeFromLocal, datetimeToLocal } from '@/services/datetime.js';
import { FormTranslation } from '@/components/crud/CrudForm.vue';

type ListRow = {
  title: string;
  announceAt: string;
  expiresAt: string;
};

const form = ref({
  announcementId: '',
  announceAt: '',
  expiresAt: '',
  title: '',
  body: '',
});

const formTranslations: Record<string, FormTranslation> = {
  announceAt: {
    from: (value: unknown) => datetimeToLocal(value as string).format('YYYY-MM-DD HH:mm'),
    to: (value: unknown) => datetimeFromLocal(value as string).utc().format('YYYY-MM-DD HH:mm'),
  },
  expiresAt: {
    from: (value: unknown) => datetimeToLocal(value as string).format('YYYY-MM-DD HH:mm'),
    to: (value: unknown) => datetimeFromLocal(value as string).utc().format('YYYY-MM-DD HH:mm'),
  },
};

const setAnnounceAtNow = () => {
  form.value.announceAt = datetimeToLocal().format('YYYY-MM-DD HH:mm');
};

const setExpiresAtEod = () => {
  form.value.expiresAt = datetimeToLocal(datetimeToLocal().hour(23).minute(59)).format('YYYY-MM-DD HH:mm');
};
</script>
