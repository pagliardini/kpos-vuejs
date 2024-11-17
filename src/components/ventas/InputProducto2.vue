<template>
  <div class="contenedor-input-boton">
    <input
        ref="codigoInput"
        type="text"
        v-model="codigo"
        @keyup.enter="handleEnter"
        placeholder="Ingresa el código del producto"
        class="input-producto"
    />
    <button class="boton-buscar" @click="handleSearch">
      <i class="pi pi-search"></i> ...
    </button>
  </div>
</template>

<script setup>
import './InputProducto.css';
import { ref, defineEmits, defineExpose, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';

const emit = defineEmits(['producto-agregado', 'abrir-modal']);
const codigo = ref('');

async function buscarProducto() {
  if (codigo.value.trim()) {
    try {
      const response = await axios.get(`http://localhost:5000/ventas/buscar/codigo?codigo=${codigo.value}`);
      const producto = response.data;
      emit('producto-agregado', producto);
      codigo.value = ''; // Limpiar el input después de agregar
    } catch (error) {
      if (error.response && error.response.status === 404) {
        Swal.fire({
          icon: 'error',
          title: 'Código no encontrado',
          text: `El código ingresado "${codigo.value}" no existe.`,
        }).then(() => {
          codigo.value = '';
        });
      } else {
        console.error('Error al buscar el producto:', error);
      }
    }
  }
}

function handleEnter() {
  // Si no hay código, abrir el modal de forma de cobro
  if (codigo.value.trim() === '') {
    emit('abrir-modal'); // Emitir evento para abrir el modal de forma de cobro
  } else {
    buscarProducto(); // Buscar producto si hay un código ingresado
  }
}

// Nueva función para manejar la búsqueda o abrir el modal
function handleSearch() {
  if (codigo.value.trim() === '') {
    emit('abrir-modal'); // Emitir evento para abrir el modal si no hay código
  }
}

function focusInput() {
  const inputElement = document.querySelector('input[type="text"]');
  if (inputElement) {
    inputElement.focus();
  }
}

onMounted(() => {
  focusInput();
});

defineExpose({ focusInput });
</script>

<style scoped>
/* Estilos opcionales */
</style>