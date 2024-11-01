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

<script setup>
import './InputProducto.css'
import {ref, defineEmits, defineExpose} from 'vue'; // Importar defineEmits y defineExpose
import axios from 'axios';

const emit = defineEmits(['producto-agregado']); // Define los eventos que se van a emitir
const codigo = ref('');

async function buscarProducto() {
  if (codigo.value.trim()) {
    try {
      const response = await axios.get(`http://localhost:5000/ventas/buscar/codigo?codigo=${codigo.value}`);
      const producto = response.data;
      emit('producto-agregado', producto); // Emitimos el objeto del producto
      codigo.value = ''; // Limpiar el input después de agregar
    } catch (error) {
      console.error('Error al buscar el producto:', error);
    }
  }
}

function focusInput() {
  // Establecer foco en el input
  const inputElement = document.querySelector('input[type="text"]');
  if (inputElement) {
    inputElement.focus();
  }
}

defineExpose({focusInput}); // Exponer el método focusInput
</script>

<style scoped>
/* Estilos específicos para InputProducto */
</style>