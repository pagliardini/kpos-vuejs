<!-- SumaVenta.vue -->
<template>
  <div class="total-container">
    <p>Total: ${{ total.toFixed(2) }}</p>
  </div>
</template>

<script>
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

<style scoped>
.total-container {
  font-weight: bold;
  padding: 10px;
}
</style>
