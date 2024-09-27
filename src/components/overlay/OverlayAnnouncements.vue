<template>
  <ActionDialog
    v-model="isVisible"
    width="600"
    no-text-padding
  >
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        icon
        title="Notifications"
      >
        <v-badge
          :model-value="unreadAnnouncementCount > 0"
          color="error"
          :content="unreadAnnouncementCount"
          :max="9"
        >
          <v-icon icon="mdi-bullhorn-outline" />
        </v-badge>
      </v-btn>
    </template>
    <template #title>
      <v-icon
        icon="mdi-bullhorn-outline"
        class="mr-4"
      />
      Announcements
      <v-spacer />
      <v-btn
        variant="text"
        icon="mdi-close"
        size="small"
        @click.prevent="isVisible = false"
      />
    </template>
    <ServerError
      v-if="hasError"
      action-text="Refresh Page"
    />
    <v-list
      v-else-if="sessionData.announcements.length"
      class="pa-0"
    >
      <v-list-item
        v-for="(row, index) in sessionData.announcements as Row[]"
        :key="`row-${index}`"
        class="pa-0"
      >
        <v-list-item-title class="d-flex align-center text-h6 pa-4">
          {{ row.title }}
          <v-spacer />
          <v-chip
            v-if="!row.isRead"
            color="error"
            size="x-small"
            class="mr-2"
          >
            Unread
          </v-chip>
          <v-btn
            v-if="!row.isRead"
            variant="text"
            color="primary"
            size="small"
            @click.prevent="runMarkAnnouncementRead(row.announcementId)"
          >
            Mark as Read
          </v-btn>
          <v-chip
            v-else
            color="secondary"
            size="small"
            append-icon="mdi-check"
          >
            Read
          </v-chip>
        </v-list-item-title>
        <v-list-item-subtitle class="px-4 mt-n4">
          {{ datetimeToLocal(row.announceAt).format('dddd, MMM D, YYYY') }}
        </v-list-item-subtitle>
        <p class="text-medium-emphasis pa-4">
          {{ row.body }}
        </p>
        <v-divider />
      </v-list-item>
    </v-list>
    <v-empty-state
      v-else
      title="No announcements posted"
      color="primary"
      image="/blank_canvas.svg"
    />
  </ActionDialog>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import useSession from '@/stores/session.js';
import { datetimeToLocal } from '@/services/datetime.js';
import api from '@/services/api.js';
import { storeToRefs } from 'pinia';

type Row = {
  announcementId: string;
  isRead: boolean;
  announceAt: string;
  body: string;
  title: string;
};

const isVisible = ref(false);
const hasError = ref(false);
const isCalling = ref(false);

const session = useSession();

const { unreadAnnouncementCount, sessionData } = storeToRefs(session);

const runMarkAnnouncementRead = (announcementId: string) => {
  hasError.value = false;
  isCalling.value = true;
  api.post(`/session/mark-announcement-read`, { announcementId })
    .then((res) => {
      session.setSession(res.data);
    })
    .catch(async () => {
      hasError.value = true;
    })
    .finally(() => {
      isCalling.value = false;
    });
};

watch(() => session.unreadAnnouncementCount, (newVal) => {
  if (newVal) {
    isVisible.value = true;
  }
});

onMounted(() => {
  if (session.unreadAnnouncementCount) {
    isVisible.value = true;
  }
});
</script>
