<template>
  <div @keydown="handleKeydown" tabindex="0">
    <table class="min-w-full">
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
          v-for="(producto, index) in productos"
          :key="index"
          :class="{ 'highlight': index === selectedIndex }"
      >
        <td>{{ producto.codigo }}</td>
        <td>{{ producto.nombre }}</td>
        <td>${{ producto.precio.toFixed(2) }}</td>
        <td>
          <input
              type="number"
              v-model.number="producto.cantidad"
              @input="actualizarSubtotal(producto)"
              min="1"
              class="w-16 text-center"
          />
        </td>
        <td>${{ (producto.precio * producto.cantidad).toFixed(2) }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    productos: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selectedIndex: 0 // Índice del producto seleccionado
    };
  },
  mounted() {
    // Establecer la cantidad predeterminada a 1 para cada producto si aún no está definida
    this.productos.forEach(producto => {
      if (!producto.cantidad) {
        producto.cantidad = 1;
        this.actualizarSubtotal(producto); // Asegura que el subtotal también esté actualizado
      }
    });
  },
  methods: {
    handleKeydown(event) {
      if (event.key === 'ArrowDown') {
        this.selectedIndex = (this.selectedIndex + 1) % this.productos.length; // Mover hacia abajo
      } else if (event.key === 'ArrowUp') {
        this.selectedIndex = (this.selectedIndex - 1 + this.productos.length) % this.productos.length; // Mover hacia arriba
      } else if (event.key === '*') {
        event.preventDefault(); // Prevenir que el '*' se cargue en el input
        this.modificarCantidad(); // Abrir el prompt para modificar la cantidad
      }
    },
    modificarCantidad() {
      const productoSeleccionado = this.productos[this.selectedIndex];
      const nuevaCantidad = prompt(
          `Modificar cantidad para ${productoSeleccionado.nombre}`,
          productoSeleccionado.cantidad
      );

      if (nuevaCantidad !== null) {
        const cantidadNumerica = parseInt(nuevaCantidad, 10);

        if (!isNaN(cantidadNumerica) && cantidadNumerica > 0) {
          productoSeleccionado.cantidad = cantidadNumerica;
          this.actualizarSubtotal(productoSeleccionado); // Actualizar el subtotal inmediatamente
        } else {
          alert('Por favor, ingresa un número válido mayor a 0.');
        }
      }
    },
    actualizarSubtotal(producto) {
      // `v-model` reactiva automáticamente los cambios y actualizará el subtotal en la vista
      producto.subtotal = producto.precio * producto.cantidad;
    }
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeydown); // Limpiar el listener al destruir el componente
  }
};
</script>

<style scoped>
.highlight {
  background-color: #f0f8ff;
}
</style>
