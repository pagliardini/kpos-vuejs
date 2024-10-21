<template>
  <div>
    <table class="min-w-full border border-collapse">
      <thead class="bg-gray-800 text-white">
      <tr>
        <th class="border px-2 text-left">Código</th>
        <th class="border px-2 text-left">Nombre</th>
        <th class="border px-2 text-left">Costo</th>
        <th class="border px-2 text-left">Precio</th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="(producto, index) in productos"
          :key="producto.id"
          :class="{'bg-gray-300': selectedIndex === index}"
          @click="selectRow(index)"
          @mouseenter="hoverIndex = index"
          @mouseleave="hoverIndex = null"
      >
        <td class="border px-2 py-1 text-left">{{ producto.codigo1 }}</td>
        <td class="border px-2 py-1 text-left">{{ producto.nombre }}</td>
        <td class="border px-2 py-1 text-right">{{ producto.costo }}</td>
        <td class="border px-2 py-1 text-right">{{ producto.precio }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'ProductosSelect',
  props: {
    productos: Array,
    selectedIndex: Number,
  },
  data() {
    return {
      hoverIndex: null, // To highlight the row on hover
    };
  },
  methods: {
    selectRow(index) {
      this.$emit('select', index); // Emit the selected index
    },
  },
};
</script>

<style scoped>
/* You can add custom styles here if needed */
</style>
