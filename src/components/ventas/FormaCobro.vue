<template>
  <div>
  </div>
</template>

<script setup>
import { ref, defineExpose, defineProps, defineEmits } from 'vue';
import Swal from 'sweetalert2';
import axios from 'axios';

const emit = defineEmits(['venta-procesada']);

const props = defineProps({
  totalVenta: {
    type: Number,
    required: true,
  },
  productos: {
    type: Array,
    required: true,
  }
});

const paymentMethods = ref([]);
const selectedPaymentMethod = ref(null);
const activeIndex = ref(0);
const changeAmount = ref(0); // Nuevo estado para el vuelto

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

  // Calcular el recargo para actualizar el total
  const recargo = paymentMethods.value[activeIndex.value].recargo || 0; // Obtiene el recargo
  const totalConRecargo = props.totalVenta * (1 + recargo / 100); // Calcula el total con recargo

  // Actualizar el h1 con el nuevo total
  const totalElement = document.querySelector('.total-pagar');
  if (totalElement) {
    totalElement.textContent = `Total a Pagar: ${formatCurrency(totalConRecargo)}`;
  }

  rows.forEach((row, index) => {
    const input = row.querySelector('.payment-input');

    if (input) { // Verifica que el input exista
      if (index === activeIndex.value) {
        input.value = totalConRecargo.toFixed(2); // Asigna el total con recargo al input seleccionado
        input.focus();
        input.select(); // Seleccionar el contenido del input
      } else {
        input.value = 0; // Los demás inputs muestran 0
      }
    }

    row.classList.toggle('selected', index === activeIndex.value);
  });

  // Recalcular el vuelto al cambiar de método de pago
  recalculateChange();
}

function recalculateChange() {
  const activeInput = document.querySelector('.payment-input:focus');
  if (activeInput) {
    const amountPaid = parseFloat(activeInput.value) || 0;
    const recargo = paymentMethods.value[activeIndex.value].recargo || 0;
    changeAmount.value = amountPaid - (props.totalVenta * (1 + recargo / 100));
    const changeElement = document.querySelector('#change-amount');
    if (changeElement) {
      changeElement.textContent = formatCurrency(changeAmount.value);
    }
  }
}

async function abrirModal() {
  await fetchPaymentMethods();
  activeIndex.value = 0;

  const result = await Swal.fire({
    title: 'Forma de Cobro',
    html: `
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-xl font-bold total-pagar">Total a Pagar: ${formatCurrency(props.totalVenta)}</h1>
        <div class="text-lg font-semibold">
          <strong>Vuelto:</strong> <span id="change-amount">${formatCurrency(changeAmount.value)}</span>
        </div>
      </div>
      <div tabindex="0" id="payment-container" class="outline-none">
        <table id="payment-table" class="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr class="bg-gray-200 text-gray-700">
              <th class="py-2 px-4 border-b">Denominación</th>
              <th class="py-2 px-4 border-b">Recargo</th>
              <th class="py-2 px-4 border-b">Paga Con</th>
            </tr>
          </thead>
          <tbody>
            ${paymentMethods.value.map((method, index) => `
              <tr class="hover:bg-gray-100 transition duration-200">
                <td class="py-2 px-4 border-b">${method.denominacion}</td>
                <td class="py-2 px-4 border-b">${method.recargo}%</td>
                <td class="py-2 px-4 border-b">
                  <input type="number" value="${props.totalVenta * (1 + method.recargo / 100)}" style="width:100%;" placeholder="Ingrese monto"
                         data-index="${index}" class="payment-input border rounded-md p-1" />
                </td>
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

      // Agregar el evento de tecla Enter para confirmar pago
      container.addEventListener('keydown', handleEnterKey);

      // Agregar evento para manejar el cambio en los inputs de pago
      const paymentInputs = modal.querySelectorAll('.payment-input');
      paymentInputs.forEach((input, index) => {
        input.addEventListener('input', () => {
          const amountPaid = parseFloat(input.value) || 0;
          const totalRecargo = paymentMethods.value[index].recargo || 0;
          changeAmount.value = amountPaid - (props.totalVenta * (1 + totalRecargo / 100));
          modal.querySelector('#change-amount').textContent = formatCurrency(changeAmount.value);
        });

        // Resetear valor del vuelto al cambiar de método
        input.addEventListener('focus', () => {
          changeAmount.value = parseFloat(input.value) - (props.totalVenta * (1 + paymentMethods.value[index].recargo / 100));
          modal.querySelector('#change-amount').textContent = formatCurrency(changeAmount.value);
        });
      });

      updateSelection(); // Llama a esta función para seleccionar el primer input
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
        container.removeEventListener('keydown', handleEnterKey);
      }
    }
  });

  if (result.isConfirmed) {
    await procesarVenta(); // Llama a la función para procesar la venta
  } else {
    cerrarModal();
  }
}
function handleEnterKey(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    Swal.clickConfirm(); // Simula hacer clic en el botón Confirmar Pago
  }
}

async function procesarVenta() {
  if (!selectedPaymentMethod.value) return;

  try {
    const response = await axios.post('http://localhost:5000/ventas/procesar', {
      productos: props.productos, // Asegúrate de que este prop contenga los productos seleccionados
      forma_cobro_id: selectedPaymentMethod.value.id, // ID de la forma de cobro seleccionada
    });

    console.log('Venta procesada:', response.data);

    emit('venta-procesada'); // Emitir el evento aquí


    Swal.fire({
      title: 'Éxito',
      text: 'La venta se ha procesado correctamente.',
      icon: 'success'
    });

    cerrarModal(); // Cerrar modal después de procesar
  } catch (error) {
    console.error('Error al procesar la venta:', error);

    Swal.fire({
      title: 'Error',
      text: 'No se pudo procesar la venta. Inténtalo nuevamente.',
      icon: 'error'
    });

    cerrarModal(); // También puedes cerrar el modal aquí si lo deseas
  }
}

function formatCurrency(value) {
  const options = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
  return new Intl.NumberFormat('es-CO', options).format(value);
}

function cerrarModal() {
  selectedPaymentMethod.value = null;
}

defineExpose({ abrirModal });
</script>

<style>
.selected {
  background-color: #cce5ff;
}

.total-pagar {
  font-weight: bolder;
}
</style>