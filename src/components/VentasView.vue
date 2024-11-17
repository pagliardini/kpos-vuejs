<template>
  <section class="p-6 flex">
    <div class="izquierda">
      <InputProducto
          ref="inputProducto"
          @producto-agregado="agregarProducto"
          @abrir-modal-cobro="abrirModalCobro"
          @abrir-modal-busqueda="abrirModalBusqueda"

      />
      <ListaProductos
          :productos="productos"
          @actualizar-producto="actualizarProducto"
          @eliminar-producto="eliminarProducto"
          @modal-closed="focusInput"
      />
      <BuscarPorNombre ref="productosModal" />
    </div>
    <div class="derecha">
      <SumaVenta :productos="productos" />
      <BotonVenta :productos="productos" @venta-procesada="limpiarProductos" />
      <BotonCancelar />
    </div>
    <FormaCobro
        ref="formaCobro"
        :totalVenta="totalVenta"
        @confirm-payment="procesarVenta"
        :productos="productos"
        @venta-procesada="limpiarProductos"
    />
  </section>
</template>

<script>
import { ref, computed } from 'vue';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import InputProducto from '@/components/ventas/InputProducto.vue';
import ListaProductos from '@/components/ventas/ListaProductos.vue';
import BotonVenta from "@/components/ventas/BotonVenta.vue";
import SumaVenta from "@/components/ventas/SumaVenta.vue";
import FormaCobro from '@/components/ventas/FormaCobro.vue';
import BotonCancelar from "@/components/ventas/BotonCancelar.vue";
import axios from "axios";
import BuscarPorNombre from "@/components/ventas/BuscarPorNombre.vue";

export default {
  name: 'VentasView',
  components: {
    BuscarPorNombre,
    BotonCancelar,
    InputProducto,
    ListaProductos,
    BotonVenta,
    SumaVenta,
    FormaCobro,
  },
  methods: {
    showModal() {
      this.$refs.productosModal.openModal()
    }
  },
  setup() {
    const productos = ref([]);
    const inputProducto = ref(null);
    const formaCobro = ref(null);
    const productosModal = ref(null);

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
      if (producto) {
        producto.cantidad = cantidad;
        producto.subtotal = producto.precio * cantidad;
      }
    }

    function eliminarProducto(index) {
      // Mostrar SweetAlert2 para confirmar la eliminación
      Swal.fire({
        title: '¿Deseas eliminar éste artículo?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo!'
      }).then((result) => {
        if (result.isConfirmed) {
          // Eliminar el producto si se confirma
          if (index > -1 && index < productos.value.length) {
            productos.value.splice(index, 1);
            Swal.fire(
                '¡Eliminado!',
                'El producto ha sido eliminado.',
                'success'
            );
          }
        }
      });
    }

    function limpiarProductos() {
      productos.value = [];
      inputProducto.value.focusInput();
    }

    function focusInput() {
      inputProducto.value.focusInput();
    }

    function abrirModalCobro() {
      formaCobro.value.abrirModal();
    }

    function abrirModalBusqueda() {
      console.log('Intentando abrir el modal de búsqueda');
      if (productosModal.value) {
        productosModal.value.openModal();
      } else {
        console.error('La referencia productosModal no está disponible');
      }
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
      productosModal, // Asegúrate de exponer la referencia
      agregarProducto,
      actualizarProducto,
      eliminarProducto, // Exponer el método para eliminar productos
      limpiarProductos,
      focusInput,
      abrirModalCobro,
      procesarVenta,
      abrirModalBusqueda,
    };
  },
}
</script>

<style scoped>
/* Estilo general para el cuerpo */
body {
  font-family: 'Arial', sans-serif;
  background-color: #f4f7fa; /* Color de fondo claro */
  margin: 0;
  padding: 0;
}

/* Contenedor principal */
.flex {
  display: flex;
  height: auto; /* Cambio a auto para permitir flexibilidad */
  min-height: 400px; /* Altura mínima para asegurar espacio */
  margin: 20px;
  border-radius: 8px; /* Bordes redondeados */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Sombra suave */
  background-color: white; /* Fondo blanco para el contenedor */
}

/* Sección izquierda */
.izquierda {
  flex: 2; /* Proporción de flexibilidad */
  padding: 20px;
  box-sizing: border-box;
  border-right: 1px solid #e0e0e0; /* Línea divisoria */
}

/* Sección derecha */
.derecha {
  flex: 1; /* Proporción de flexibilidad */
  padding: 20px;
  box-sizing: border-box;
}

/* Estilo para botones */
button {
}

/* Responsividad */
@media (max-width: 768px) {
}
</style>