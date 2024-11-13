import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Import Tailwind's CSS (this is necessary to enable Tailwind styling)
import './assets/main.css';  // <-- Add this line to import Tailwind
import 'primeicons/primeicons.css';
// Crear la instancia de la aplicación Vue
const app = createApp(App);

// Usar el router en la aplicación
app.use(router);

// Montar la aplicación
app.mount('#app');
