<template>

    <h1 class="text-2xl font-bold">Productos</h1>
    <ProductosTabla></ProductosTabla>




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
      nombreProducto: ''
    };
  }
};
</script>


