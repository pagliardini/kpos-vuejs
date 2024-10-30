<template>
  <input
      ref="codigoInput"
  type="text"
  v-model="codigo"
  @keyup.enter="buscarProducto"
  placeholder="Ingresa el código del producto"
  class="input-producto"
  />
</template>

<script>
import './InputProducto.css';
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
    },
    focusInput() {
      this.$refs.codigoInput.focus(); // Establecer foco en el input
    }
  },
  mounted() {
    this.focusInput(); // Llamar a la función para establecer el foco al montar el componente
  },
  watch: {
    codigo() {
      this.focusInput(); // Mantener el foco en el input cuando cambia el valor
    }
  }
}
</script>

<style scoped>
/* Estilos específicos para InputProducto */
</style>