<!-- VentasView.vue -->
<template>
  <section class="p-6">
    <h1 class="text-2xl font-bold">Ventas</h1>
    <InputProducto @producto-agregado="agregarProducto" />
    <ListaProductos :productos="productos" />
  </section>
</template>

<script>
// Importamos los componentes hijos
import InputProducto from '@/components/ventas/InputProducto.vue';
import ListaProductos from '@/components/ventas/ListaProductos.vue';

export default {
  name: 'VentasView',
  components: {
    InputProducto,
    ListaProductos
  },
  data() {
    return {
      productos: [] // Inicializamos un array vacío para almacenar los productos
    };
  },
  methods: {
    agregarProducto(producto) {
      this.productos.push(producto); // Agregamos el nuevo producto a la lista
    }
  }
}
</script>

<style scoped>
/* Estilos específicos para VentasView */
</style>