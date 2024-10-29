<!-- SumaVenta.vue -->
<template>
    <p class="suma-venta">Total: ${{ total.toFixed(2) }}</p>
</template>

<script>
import './SumaVenta.css'
export default {
  props: {
    productos: {
      type: Array,
      required: true
    }
  },
  computed: {
    total() {
      // Calcula la suma de todos los subtotales de los productos
      return this.productos.reduce((acc, producto) => acc + producto.precio, 0);
    }
  }
}
</script>

