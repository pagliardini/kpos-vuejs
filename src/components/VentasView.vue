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
    <FormaCobro ref="formaCobro" :totalVenta="totalVenta" @confirm-payment="procesarVenta" :productos="productos" />
  </section>
</template>

<script>
import InputProducto from '@/components/ventas/InputProducto.vue';
import ListaProductos from '@/components/ventas/ListaProductos.vue';
import BotonVenta from "@/components/ventas/BotonVenta.vue";
import SumaVenta from "@/components/ventas/SumaVenta.vue";
import FormaCobro from '@/components/ventas/FormaCobro.vue'; // Asegúrate de que la ruta sea correcta
import axios from "axios";
import Swal from "sweetalert2";

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
  computed: {
    totalVenta() {
      return this.productos.reduce((acc, producto) => acc + producto.subtotal, 0);
    }
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
    },
    async procesarVenta(data) {
      try {
        const response = await axios.post('http://localhost:5000/ventas/procesar', {
          productos: data.productos,
          forma_cobro_id: data.formaCobroId,
        });

        console.log('Venta procesada:', response.data);

        Swal.fire({
          title: 'Éxito',
          text: 'La venta se ha procesado correctamente.',
          icon: 'success'
        });

        this.limpiarProductos(); // Limpiar productos después de procesar
      } catch (error) {
        console.error('Error al procesar la venta:', error);

        Swal.fire({
          title: 'Error',
          text: 'No se pudo procesar la venta. Inténtalo nuevamente.',
          icon: 'error'
        });
      }
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