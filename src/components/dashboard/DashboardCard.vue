<template>
  <v-card>
    <v-card-title>
      {{ title }}
    </v-card-title>
    <v-card-text v-if="isLoading">
      <v-progress-circular indeterminate />
    </v-card-text>
    <v-card-text v-else-if="hasError">
      <v-alert type="error">
        Could not load count
        <template #append>
          <v-btn
            variant="text"
            size="small"
            @click.prevent="loadCount"
          >
            Try Again
          </v-btn>
        </template>
      </v-alert>
    </v-card-text>
    <v-card-text v-else>
      <h1>{{ count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}{{ suffix }}</h1>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import api from '@/services/api.js';

const props = defineProps<{
  title: string;
  route: string;
  suffix?: string;
}>();

const isLoading = ref(true);
const hasError = ref(false);
const count = ref(0);

let controller = new AbortController();

const loadCount = () => {
  controller.abort();
  controller = new AbortController();
  const path = `/dashboard/${props.route}`;
  api.get(path)
    .then((response) => {
      count.value = response.data.count;
    })
    .catch(() => {
      hasError.value = true;
    })
    .finally(() => {
      isLoading.value = false;
    });
};

onMounted(() => {
  loadCount();
});
</script>
