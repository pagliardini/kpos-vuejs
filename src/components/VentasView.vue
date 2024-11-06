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
    <FormaCobro
        ref="formaCobro"
        :totalVenta="totalVenta"
        @confirm-payment="procesarVenta"
        :productos="productos"
        @venta-procesada="limpiarProductos"
    />  </section>
</template>

<script>
import { ref, computed } from 'vue';
import InputProducto from '@/components/ventas/InputProducto.vue';
import ListaProductos from '@/components/ventas/ListaProductos.vue';
import BotonVenta from "@/components/ventas/BotonVenta.vue";
import SumaVenta from "@/components/ventas/SumaVenta.vue";
import FormaCobro from '@/components/ventas/FormaCobro.vue';
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: 'VentasView',
  components: {
    InputProducto,
    ListaProductos,
    BotonVenta,
    SumaVenta,
    FormaCobro,
  },
  setup() {
    const productos = ref([]);
    const inputProducto = ref(null);
    const formaCobro = ref(null);

    const totalVenta = computed(() => {
      return productos.value.reduce((acc, producto) => acc + producto.subtotal, 0);
    });

    function agregarProducto(producto) {
      const productoExistente = productos.value.find((p) => p.codigo === producto.codigo);
      if (productoExistente) {
        productoExistente.cantidad += 1;
        productoExistente.subtotal = productoExistente.precio * productoExistente.cantidad;
      } else {
        producto.cantidad = 1;
        producto.subtotal = producto.precio;
        productos.value.push(producto);
      }
    }

    function actualizarProducto(index, cantidad) {
      const producto = productos.value[index];
      producto.cantidad = cantidad;
      producto.subtotal = producto.precio * cantidad;
    }

    function limpiarProductos() {
      productos.value = [];
      inputProducto.value.focusInput();
    }

    function focusInput() {
      inputProducto.value.focusInput();
    }

    function abrirModal() {
      formaCobro.value.abrirModal();
    }

    async function procesarVenta(data) {
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

        limpiarProductos();
        // Emit the event after successful processing
        formaCobro.value.$emit('venta-procesada');
      } catch (error) {
        console.error('Error al procesar la venta:', error);

        Swal.fire({
          title: 'Error',
          text: 'No se pudo procesar la venta. Inténtalo nuevamente.',
          icon: 'error'
        });
      }
    }

    return {
      productos,
      totalVenta,
      inputProducto,
      formaCobro,
      agregarProducto,
      actualizarProducto,
      limpiarProductos,
      focusInput,
      abrirModal,
      procesarVenta,
    };
  },
}
</script>

<style scoped>
.flex {
  display: flex;
  height: 37vh;
}

.izquierda {
  width: 66.67%;
  padding: 20px;
  box-sizing: border-box;
}

.derecha {
  width: 33.33%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>