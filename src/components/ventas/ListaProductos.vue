<template>
  <div>
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
              @click="selectProduct(index)"
          />
        </td>
        <td>{{ product.subtotal }}</td>
      </tr>
      </tbody>
    </table>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2>Ingresa la nueva cantidad</h2>
        <input
            type="text"
        v-model="newQuantity"
        placeholder="Cantidad"
        class="form-control"
        ref="quantityInput"
        @keyup.enter="updateQuantity"
        />
        <button class="btn btn-primary" @click="updateQuantity">Actualizar</button>
      </div>
    </div>
  </div>
</template>

<script>

import './ListaProductos.css'

export default {
  props: {
    productos: Array,
  },
  data() {
    return {
      selectedIndex: 0,
      showModal: false,
      newQuantity: 1,
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
    selectProduct(index) {
      this.selectedIndex = index;
    },
    handleKeyDown(event) {
      if (event.key === 'ArrowDown') {
        this.selectNext();
      } else if (event.key === 'ArrowUp') {
        this.selectPrevious();
      } else if (event.key === '*') {
        event.preventDefault(); // Evitar el comportamiento predeterminado
        this.openModal();
      }
    },
    openModal() {
      this.showModal = true;
      this.newQuantity = this.productos[this.selectedIndex]?.cantidad || 1;

      this.$nextTick(() => {
        this.$refs.quantityInput.focus();
        this.$refs.quantityInput.select(); // Seleccionar el texto del input
      });
    },
    closeModal() {
      this.showModal = false;
    },
    updateQuantity() {
      const product = this.productos[this.selectedIndex];
      if (product) {
        const parsedQuantity = parseInt(this.newQuantity, 10);
        if (!isNaN(parsedQuantity)) {
          product.cantidad = parsedQuantity; // Actualiza la cantidad
          product.subtotal = product.precio * parsedQuantity; // Actualiza el subtotal
          this.$emit('actualizar-producto', this.selectedIndex, product.cantidad); // Emite el evento
        }
      }
      this.closeModal(); // Cierra el modal
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

</style>
