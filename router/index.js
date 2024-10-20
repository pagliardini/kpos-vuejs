import { createRouter, createWebHistory } from 'vue-router';
import Productos from '@/views/Productos.vue';

const routes = [
    {
        path: '/productos',
        name: 'Productos',
        component: Productos,
    },
    // Otras rutas...
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
