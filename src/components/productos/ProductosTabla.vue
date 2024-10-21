<template>
  <div class="p-6">
    <input
        type="text"
        v-model="searchQuery"
        placeholder="Buscar por código o nombre"
        class="mb-4 p-2 border border-gray-300 rounded"
    />
    <table class="min-w-full border border-collapse">
      <thead class="bg-gray-800 text-white">
      <tr>
        <th class="border px-2 py-1 text-left">Código</th>
        <th class="border px-2 py-1 text-left">Nombre</th>
        <th class="border px-2 py-1 text-left">Costo</th>
        <th class="border px-2 py-1 text-left">Precio</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="producto in filteredProductos" :key="producto.id">
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
  name: 'ProductosTabla',
  data() {
    return {
      productos: [],
      searchQuery: '', // Input model for search
    };
  },
  created() {
    this.fetchProductos();
  },
  computed: {
    filteredProductos() {
      if (!this.searchQuery) {
        return this.productos; // Return all products if no search query
      }
      const query = this.searchQuery.toLowerCase();
      return this.productos.filter((producto) =>
          producto.codigo1.toLowerCase().includes(query) ||
          producto.nombre.toLowerCase().includes(query)
      );
    },
  },
  methods: {
    async fetchProductos() {
      try {
        const response = await fetch('http://localhost:5000/productos', {
          headers: {
            'Accept': 'application/json',
          },
        });
        const data = await response.json();
        this.productos = data.productos;
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
  },
};
</script>
