<template>
  <table class="table table-striped">
    <thead>
    <tr>
      <th>Código</th>
      <th>Nombre</th>
      <th>Precio</th>
      <th>Cantidad</th>
      <th>Subtotal</th>
    </tr>
    </thead>
    <tbody>
    <tr
        v-for="(product, index) in productos"
        :key="index"
        :class="{ 'selected-row': index === selectedIndex }"
    >
      <td>{{ product.codigo }}</td>
      <td>{{ product.nombre }}</td>
      <td>{{ product.precio }}</td>
      <td>
        <input
            type="number"
            class="form-control"
            v-model.number="product.cantidad"
            @input="$emit('actualizar-producto', index, product.cantidad)"
            :min="1"
        />
      </td>
      <td>{{ product.subtotal }}</td>
    </tr>
    </tbody>
  </table>
</template>

<script>

import './ListaProductos.css'

export default {
  props: {
    productos: Array,
  },
  data() {
    return {
      selectedIndex: 0, // Índice inicial de la fila seleccionada
    };
  },
  methods: {
    selectNext() {
      if (this.selectedIndex < this.productos.length - 1) {
        this.selectedIndex++;
      }
    },
    selectPrevious() {
      if (this.selectedIndex > 0) {
        this.selectedIndex--;
      }
    },
    handleKeyDown(event) {
      if (event.key === 'ArrowDown') {
        this.selectNext();
      } else if (event.key === 'ArrowUp') {
        this.selectPrevious();
      }
    },
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeyDown);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  },
};
</script>

<style scoped>
.selected-row {
  background-color: #f0f8ff; /* Cambia el color de fondo para resaltar la fila */
}
</style>
