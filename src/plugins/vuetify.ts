import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          navigation: '#333644',
          background: '#f9f9f9',
          secondary: '#333644',
        },
      },
      dark: {
        colors: {
          navigation: '#212121',
          background: '#424242',
          secondary: '#e0e0e0',
        },
      },
    },
  },
  defaults: {
    VAlert: {
      variant: 'tonal',
      border: 'start',
      density: 'comfortable',
    },
    VChip: {
      label: true,
    },
    VTextarea: {
      variant: 'outlined',
      hideDetails: 'auto',
      class: 'mb-4',
    },
    VTextField: {
      variant: 'outlined',
      hideDetails: 'auto',
      class: 'mb-4',
    },
    VSelect: {
      variant: 'outlined',
      hideDetails: 'auto',
      class: 'mb-4',
    },
    VProgressCircular: {
      color: 'primary',
    },
  },
});
