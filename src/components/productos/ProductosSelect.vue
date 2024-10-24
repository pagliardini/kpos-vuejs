<template>
  <div class="flex">
    <!-- Contenedor de la tabla -->
    <div class="flex-grow overflow-x-auto">
      <table class="table fixed-width">
        <thead>
        <tr>
          <th class="border px-2 text-left">Código</th>
          <th class="border px-2 text-left">Nombre</th>
          <th class="border px-2 text-left">Costo</th>
          <th class="border px-2 text-left">Precio</th>
          <th class="border px-2 text-left">Stock</th>
          <th class="border px-2 text-left">Creado</th>
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
          <td class="border px-2 py-1 text-right">{{ producto.stock }}</td>
          <td class="border px-2 py-1 text-right">{{ formatDate(producto.fecha_creacion) }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Contenedor de botones -->
    <div class="crud-container">
      <div class="crud">
        <router-link to="/productos/agregar">
        <button @click="actionOne" class="crud-button bg-blue-600">
          <svg class="w-6 h-6 text-white mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
          </svg>
          Agregar/Modificar
        </button>
        </router-link>
        <button @click="actionTwo" class="crud-button bg-green-600">
          <svg class="w-6 h-6 text-white mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2"/>
          </svg>
          Precios
        </button>
        <button @click="actionThree" class="crud-button bg-purple-600">
          <svg class="w-6 h-6 text-white mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.583 8.445h.01M10.86 19.71l-6.573-6.63a.993.993 0 0 1 0-1.4l7.329-7.394A.98.98 0 0 1 12.31 4l5.734.007A1.968 1.968 0 0 1 20 5.983v5.5a.992.992 0 0 1-.316.727l-7.44 7.5a.974.974 0 0 1-1.384.001Z"/>
          </svg>
          Rubros/Marcas/Tipos
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import './ProductosSelect.css'

export default {
  name: 'ProductosSelect',
  props: {
    productos: Array,
    selectedIndex: Number,
  },
  data() {
    return {
      hoverIndex: null,
    };
  },
  methods: {
    selectRow(index) {
      this.$emit('select', index);
    },
    actionOne() {
      console.log('Acción 1 ejecutada');
    },
    actionTwo() {
      console.log('Acción 2 ejecutada');
    },
    actionThree() {
      console.log('Acción 3 ejecutada');
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son de 0 a 11
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${day}/${month}/${year} ${hours}:${minutes}`;
    },
  },
}
</script>
