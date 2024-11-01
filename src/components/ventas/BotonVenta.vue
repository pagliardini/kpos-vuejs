<template>
  <div>
    <button @click="procesarVenta" class="boton-venta">
      Cobrar
    </button>
    <p v-if="mensaje">{{ mensaje }}</p>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import axios from 'axios';
import './BotonVenta.css';

const props = defineProps({
  productos: Array
});
const emit = defineEmits(['venta-procesada']); // Esta línea está bien

const mensaje = ref('');

async function procesarVenta() {
  try {
    const response = await axios.post('http://localhost:5000/ventas/procesar', {
      productos: props.productos
    });

    if (response.status === 200) {
      mensaje.value = 'Venta procesada con éxito';
      emit('venta-procesada'); // Emitir evento al procesar la venta
    }
  } catch (error) {
    console.error('Error al procesar la venta:', error);
    mensaje.value = 'Error al procesar la venta';
  }
}
</script>
