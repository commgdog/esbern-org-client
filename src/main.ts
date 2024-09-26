import App from './App.vue';
import router from '@/plugins/router.js';
import vuetify from '@/plugins/vuetify.js';

import pinia from '@/plugins/pinia.js';

import { createApp } from 'vue';

const app = createApp(App);

app.use(router);
app.use(vuetify);
app.use(pinia);

app.mount('#app');
