<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold">Productos</h1>
    <!-- You can add other components here later -->

    <ProductosTabla></ProductosTabla>


  </div>
</template>

<script>
import ProductosTabla from "@/components/productos/ProductosTabla.vue";

export default {
  name: 'ProductosView',
  components: {
    ProductosTabla,
  },
  data() {
    return {
      nombreProducto: '' // Variable para almacenar el valor del input
    };
  }
};
</script>


