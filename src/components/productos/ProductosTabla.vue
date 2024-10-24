<template>
  <div class="principal" tabindex="0">
    <div class="tabla">
    <input
        type="text"
        v-model="searchQuery"
        placeholder="Buscar por código o nombre"
        class="mb-4 p-2 border border-gray-300 rounded"
        ref="searchInput"
        @focus="inputFocused = true"
        @blur="inputFocused = false"
    />
    </div>
    <ProductosSelect
        :productos="paginatedProductos"
        :selectedIndex="selectedIndex"
        @select="selectProduct"
    />

    <div class="mt-4 w-full">
      <div class="fixed justify-between w-20px">
        <button @click="previousPage" :disabled="currentPage === 1" class="flex-1 px-4 py-1 bg-gray-800 text-white rounded-l">Anterior</button>
        <button @click="nextPage" :disabled="currentPage >= totalPages" class="flex-1 px-4 py-1 bg-gray-800 text-white rounded-r">Siguiente</button>
      </div>
    </div>
  </div>
</template>

<script>
import './ProductosTabla.css';
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
  mounted() {
    this.$refs.searchInput.focus(); // Set focus on the input when the component is mounted
  },
  created() {
    this.fetchProductos();
    window.addEventListener('keydown', this.handleKeydown); // Add global keydown listener
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeydown); // Remove listener to prevent memory leaks
  },
  watch: {
    searchQuery() {
      this.currentPage = 1;  // Reset to the first page when a search is performed
      this.resetSelection(); // Reset selection whenever the search query changes
    },
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
        this.resetSelection();
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.resetSelection();
      }
    },
    resetSelection() {
      this.selectedIndex = null; // Reset the selected index to null
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
      } else if (event.key === 'ArrowRight') {
        this.nextPage(); // Go to the next page
      } else if (event.key === 'ArrowLeft') {
        this.previousPage(); // Go to the previous page
      }

      // Prevent default behavior when navigating with arrow keys
      if (['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].includes(event.key)) {
        event.preventDefault();
      }
    },
    selectProduct(index) {
      this.selectedIndex = index; // Update selected index when a row is clicked
    },
  },
};
</script>
