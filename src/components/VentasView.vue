<template>
  <section class="p-6 flex">
    <div class="izquierda">
      <InputProducto ref="inputProducto" @producto-agregado="agregarProducto" @abrir-modal="abrirModal" />
      <ListaProductos
          :productos="productos"
          @actualizar-producto="actualizarProducto"
          @modal-closed="focusInput"
      />
    </div>
    <div class="derecha">
      <SumaVenta :productos="productos" />
      <BotonVenta :productos="productos" @venta-procesada="limpiarProductos" />
    </div>
    <FormaCobro ref="formaCobro" /> <!-- Importar FormaCobro aquí -->
  </section>
</template>

<script>
import InputProducto from '@/components/ventas/InputProducto.vue';
import ListaProductos from '@/components/ventas/ListaProductos.vue';
import BotonVenta from "@/components/ventas/BotonVenta.vue";
import SumaVenta from "@/components/ventas/SumaVenta.vue";
import FormaCobro from '@/components/ventas/FormaCobro.vue'; // Asegúrate de que la ruta sea correcta

export default {
  name: 'VentasView',
  components: {
    InputProducto,
    ListaProductos,
    BotonVenta,
    SumaVenta,
    FormaCobro, // Registrar el componente
  },
  data() {
    return {
      productos: []
    };
  },
  methods: {
    agregarProducto(producto) {
      const productoExistente = this.productos.find((p) => p.codigo === producto.codigo);
      if (productoExistente) {
        productoExistente.cantidad += 1;
        productoExistente.subtotal = productoExistente.precio * productoExistente.cantidad;
      } else {
        producto.cantidad = 1;
        producto.subtotal = producto.precio;
        this.productos.push(producto);
      }
    },
    actualizarProducto(index, cantidad) {
      const producto = this.productos[index];
      producto.cantidad = cantidad;
      producto.subtotal = producto.precio * cantidad;
    },
    limpiarProductos() {
      this.productos = []; // Limpiar la lista de productos
      this.$refs.inputProducto.focusInput(); // Llamar al método focusInput del componente hijo
    },
    focusInput() {
      this.$refs.inputProducto.focusInput(); // Llamar al método focusInput del componente InputProducto
    },
    abrirModal() {
      const formaCobro = this.$refs.formaCobro; // Obtener referencia a FormaCobro
      formaCobro.abrirModal(); // Llamar al método para abrir el modal
    }
  },
}
</script>

<style scoped>
.flex {
  display: flex;
  height: 37vh; /* O ajusta según sea necesario */
}

.izquierda {
  width: 66.67%; /* 2/3 de la pantalla */
  padding: 20px;
  box-sizing: border-box;
}

.derecha {
  width: 33.33%; /* 1/3 de la pantalla */
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centra verticalmente */
}
</style>