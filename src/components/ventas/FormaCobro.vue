<template>
  <div>
  </div>
</template>

<script setup>
import { ref, defineExpose, defineProps } from 'vue';
import Swal from 'sweetalert2';
import axios from 'axios';

const props = defineProps({
  totalVenta: {
    type: Number,
    required: true,
  }
});

const paymentMethods = ref([]);
const selectedPaymentMethod = ref(null);
const activeIndex = ref(0);

async function fetchPaymentMethods() {
  try {
    const response = await axios.get('http://localhost:5000/ventas/formascobro');
    paymentMethods.value = response.data;
  } catch (error) {
    console.error('Error al cargar las formas de pago:', error);
  }
}

function handleArrowKeyNavigation(event) {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    event.stopPropagation();
    if (event.key === 'ArrowDown') {
      activeIndex.value = (activeIndex.value + 1) % paymentMethods.value.length;
    } else if (event.key === 'ArrowUp') {
      activeIndex.value = (activeIndex.value - 1 + paymentMethods.value.length) % paymentMethods.value.length;
    }
    updateSelection();
  }
}

function updateSelection() {
  selectedPaymentMethod.value = paymentMethods.value[activeIndex.value];
  const rows = document.querySelectorAll('.swal2-html-container #payment-table tbody tr');
  rows.forEach((row, index) => {
    row.classList.toggle('selected', index === activeIndex.value);
  });
}

async function abrirModal() {
  await fetchPaymentMethods();
  activeIndex.value = 0;

  const result = await Swal.fire({
    title: 'Forma de Cobro',
    html: `
      <p>Total a Pagar: ${formatCurrency(props.totalVenta)}</p>
      <p>¿Cómo deseas proceder con el pago?</p>
      <div tabindex="0" id="payment-container" style="outline: none;">
        <table id="payment-table" class="w-full text-left">
          <thead>
            <tr>
              <th>Denominación</th>
              <th>Recargo</th>
            </tr>
          </thead>
          <tbody>
            ${paymentMethods.value.map(method => `
              <tr>
                <td>${method.denominacion}</td>
                <td>${method.recargo}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Confirmar Pago',
    cancelButtonText: 'Cancelar',
    didOpen: (modal) => {
      const container = modal.querySelector('#payment-container');
      container.focus();
      container.addEventListener('keydown', handleArrowKeyNavigation);
      updateSelection();
    },
    preConfirm: () => {
      if (selectedPaymentMethod.value) {
        return selectedPaymentMethod.value;
      } else {
        Swal.showValidationMessage('Por favor, selecciona una forma de pago');
        return false;
      }
    },
    willClose: () => {
      const container = document.querySelector('#payment-container');
      if (container) {
        container.removeEventListener('keydown', handleArrowKeyNavigation);
      }
    }
  });

  if (result.isConfirmed) {
    confirmarPago();
  } else {
    cerrarModal();
  }
}

function formatCurrency(value) {
  const options = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
  return new Intl.NumberFormat('es-CO', options).format(value);
}

function cerrarModal() {
  selectedPaymentMethod.value = null;
}

function confirmarPago() {
  if (selectedPaymentMethod.value) {
    console.log('Forma de pago seleccionada:', selectedPaymentMethod.value);
    // Lógica para procesar el pago
  }
}

defineExpose({ abrirModal });
</script>

<style>
.selected {
  background-color: #cce5ff;
}
</style>
