import { createRouter, createWebHistory } from 'vue-router';
import ProductosView from "@/components/ProductosView.vue";
import VentasView from "@/components/VentasView.vue";
import ComprasView from "@/components/ComprasView.vue";
import CajaView  from "@/components/CajaView.vue";

const routes = [
    {path: '/productos', component: ProductosView},
    {path: '/ventas', component: VentasView},
    {path: '/compras', component: ComprasView},
    {path: '/caja', component: CajaView},
    // Otras rutas...
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
