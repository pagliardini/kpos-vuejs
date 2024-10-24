<!-- InputProducto.vue -->
<template>
  <input
      type="text"
      v-model="codigo"
      @keyup.enter="buscarProducto"
      placeholder="Ingresa el código del producto"
      class="border p-2"
  />
  <button @click="buscarProducto" class="ml-2 bg-blue-500 text-white p-2">Agregar</button>

</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      codigo: ''
    };
  },
  methods: {
    async buscarProducto() {
      if (this.codigo.trim()) {
        try {
          const response = await axios.get(`http://localhost:5000/ventas/buscar/codigo?codigo=${this.codigo}`);
          const producto = response.data;
          this.$emit('producto-agregado', producto); // Emitimos el objeto del producto
          this.codigo = ''; // Limpiar el input después de agregar
        } catch (error) {
          console.error('Error al buscar el producto:', error);
          // Aquí puedes manejar errores, como mostrar un mensaje al usuario
        }
      }
    }
  }
}
</script>

<style scoped>
/* Estilos específicos para InputProducto */
</style>