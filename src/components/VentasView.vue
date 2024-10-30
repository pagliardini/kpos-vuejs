<template>
  <section class="p-6">
    <h1 class="text-2xl font-bold">Ventas</h1>
    <InputProducto @producto-agregado="agregarProducto" />
    <ListaProductos :productos="productos" @actualizar-producto="actualizarProducto" />
    <SumaVenta :productos="productos" />
    <BotonVenta></BotonVenta>
  </section>
</template>

<script>
import InputProducto from '@/components/ventas/InputProducto.vue';
import ListaProductos from '@/components/ventas/ListaProductos.vue';
import BotonVenta from "@/components/ventas/BotonVenta.vue";
import SumaVenta from "@/components/ventas/SumaVenta.vue";

export default {
  name: 'VentasView',
  components: {
    InputProducto,
    ListaProductos,
    BotonVenta,
    SumaVenta,
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
        // Si el producto ya existe, incrementa la cantidad y actualiza el subtotal
        productoExistente.cantidad += 1;
        productoExistente.subtotal = productoExistente.precio * productoExistente.cantidad;
      } else {
        // Si es un nuevo producto, inicializa la cantidad y subtotal, y agrégalo
        producto.cantidad = 1;
        producto.subtotal = producto.precio;
        this.productos.push(producto);
      }
    },
    actualizarProducto(index, cantidad) {
      const producto = this.productos[index];
      producto.cantidad = cantidad;
      producto.subtotal = producto.precio * cantidad;
    }
  }
}
</script>
