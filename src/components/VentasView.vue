<!-- VentasView.vue -->
<template>
  <section class="p-6">
    <h1 class="text-2xl font-bold">Ventas</h1>
    <InputProducto @producto-agregado="agregarProducto" />
    <ListaProductos :productos="productos" />
    <BotonVenta></BotonVenta>
    <suma-venta :productos="productos" />
  </section>
</template>

<script>

import InputProducto from '@/components/ventas/InputProducto.vue';
import ListaProductos from '@/components/ventas/ListaProductos.vue';
import BotonVenta from "@/components/ventas/BotonVenta.vue";
import SumaVenta from "@/components/ventas/SumaVenta.vue"

export default {
  name: 'VentasView',
  components: {
    SumaVenta,
    InputProducto,
    ListaProductos,
    BotonVenta,
  },
  data() {
    return {
      productos: []
    };
  },
  methods: {
    agregarProducto(producto) {
      this.productos.push(producto);
    }
  }
}
</script>

<style scoped>
</style>