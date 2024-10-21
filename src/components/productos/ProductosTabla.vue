<template>
  <div class="p-6" tabindex="0" @keydown="handleKeydown">
    <input
        type="text"
        v-model="searchQuery"
        placeholder="Buscar por código o nombre"
        class="mb-4 p-2 border border-gray-300 rounded"
        @focus="inputFocused = true"
        @blur="inputFocused = false"
    />

    <ProductosSelect
        :productos="paginatedProductos"
        :selectedIndex="selectedIndex"
        @select="selectProduct"
    />

    <div class="mt-4 flex justify-between">
      <button @click="previousPage" :disabled="currentPage === 1" class="px-4 py-1 bg-gray-800 text-white rounded">Anterior</button>
      <button @click="nextPage" :disabled="currentPage >= totalPages" class="px-4 py-1 bg-gray-800 text-white rounded">Siguiente</button>
    </div>
  </div>
</template>

<script>
import ProductosSelect from './ProductosSelect.vue';

export default {
  name: 'ProductosTabla',
  components: {
    ProductosSelect,
  },
  data() {
    return {
      productos: [],
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 10,
      selectedIndex: null, // Track the selected row index
      inputFocused: false, // Track if the input is focused
    };
  },
  created() {
    this.fetchProductos();
  },
  computed: {
    filteredProductos() {
      if (!this.searchQuery) {
        return this.productos;
      }
      const query = this.searchQuery.toLowerCase();
      return this.productos.filter((producto) =>
          producto.codigo1.toLowerCase().includes(query) ||
          producto.nombre.toLowerCase().includes(query)
      );
    },
    paginatedProductos() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredProductos.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredProductos.length / this.itemsPerPage);
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
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    handleKeydown(event) {
      if (event.key === 'ArrowDown') {
        if (this.selectedIndex === null) {
          this.selectedIndex = 0; // Start from the first row
        } else if (this.selectedIndex < this.paginatedProductos.length - 1) {
          this.selectedIndex++;
        }
      } else if (event.key === 'ArrowUp') {
        if (this.selectedIndex > 0) {
          this.selectedIndex--;
        }
      }

      // Prevent default behavior when navigating with arrow keys
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
      }
    },
    selectProduct(index) {
      this.selectedIndex = index; // Update selected index when a row is clicked
    },
  },
};
</script>
