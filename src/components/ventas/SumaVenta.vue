<template>
  <p class="suma-venta">Total: {{ formattedTotal }}</p>
</template>

<script>
import './SumaVenta.css';

export default {
  props: {
    productos: {
      type: Array,
      required: true,
    },
  },
  computed: {
    total() {
      return this.productos.reduce((acc, producto) => acc + producto.subtotal, 0);
    },
    formattedTotal() {
      return this.formatCurrency(this.total);
    },
  },
  methods: {
    formatCurrency(value) {
      // para convertir el número a cadena con formato
      const options = {minimumFractionDigits: 2, maximumFractionDigits: 2};
      const formattedValue = new Intl.NumberFormat('es-CO', options).format(value);
      return `$${formattedValue}`;
    },
  },
};
</script>
