<template>
  <div></div> <!-- Este div es necesario para el componente -->
</template>

<script>
import Swal from 'sweetalert2';

export default {
  name: 'BuscarPorNombre',
  data() {
    return {
      productos: [],
      searchQuery: '',
      selectedProduct: null,
      currentPage: 1,
      itemsPerPage: 15, // Limitar a 10 productos por página
    };
  },
  methods: {
    async fetchProductos() {
      try {
        const response = await fetch('http://localhost:5000/productos', {
          headers: { 'Accept': 'application/json' },
        });
        const data = await response.json();
        this.productos = data.productos;
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    openModal() {
      this.fetchProductos(); // Cargar productos al abrir el modal
      Swal.fire({
        title: 'Selecciona un Producto',
        html: this.getModalHtml(),
        focusConfirm: false,
        width: '500px',
        customClass: {
          popup: 'custom-modal-popup',
          container: 'custom-modal-container'
        },
        preConfirm: () => {
          const inputValue = document.getElementById('searchInput').value;
          return inputValue;
        },
      }).then((result) => {
        if (result.isConfirmed) {
          this.selectedProduct = result.value; // Manejar el producto seleccionado
          console.log('Producto seleccionado:', this.selectedProduct);
        }
      });

      // Agregar evento para filtrar la lista de productos
      document.getElementById('searchInput').addEventListener('input', this.filterProducts);
    },
    getModalHtml() {
      return `
    <input id="searchInput" type="text" class="swal2-input" placeholder="Buscar por código o nombre">
    <div id="productListContainer" style="height: 300px; overflow-y: auto; margin-top: 10px;">
      <ul id="productList" style="list-style-type:none; padding:0;"></ul>
    </div>
    <div style="display:flex; justify-content:space-between; margin-top: 10px;">
      <button id="prevBtn" style="display:none;">Anterior</button>
      <button id="nextBtn" style="display:none;">Siguiente</button>
    </div>
  `;
    },
    filterProducts() {
      const query = document.getElementById('searchInput').value.toLowerCase();
      const filteredProducts = this.productos.filter(producto =>
          producto.nombre.toLowerCase().includes(query)
      );

      this.currentPage = 1; // Reiniciar a la primera página al buscar
      this.updateProductList(filteredProducts);

      // Mostrar u ocultar botones de navegación
      document.getElementById('prevBtn').style.display = 'none';
      document.getElementById('nextBtn').style.display = filteredProducts.length > this.itemsPerPage ? 'block' : 'none';

      // Agregar eventos a los botones de navegación
      document.getElementById('prevBtn').onclick = () => this.changePage(-1, filteredProducts);
      document.getElementById('nextBtn').onclick = () => this.changePage(1, filteredProducts);
    },
    updateProductList(products) {
      const productList = document.getElementById('productList');
      productList.innerHTML = ''; // Limpiar la lista antes de volver a llenarla

      const start = (this.currentPage - 1) * this.itemsPerPage;
      const paginatedProducts = products.slice(start, start + this.itemsPerPage);

      paginatedProducts.forEach(producto => {
        const li = document.createElement('li');
        li.textContent = `${producto.nombre}`;
        li.style.cursor = 'pointer';
        li.onclick = () => {
          Swal.clickCancel(); // Cerrar el modal al seleccionar un producto
          this.selectedProduct = producto; // Guardar el producto seleccionado
          console.log('Producto seleccionado:', producto);
        };
        productList.appendChild(li);
      });
    },
    changePage(direction, products) {
      const totalPages = Math.ceil(products.length / this.itemsPerPage);

      if (direction === -1 && this.currentPage > 1) {
        this.currentPage--;
      } else if (direction === 1 && this.currentPage < totalPages) {
        this.currentPage++;
      }

      this.updateProductList(products); // Actualizar la lista mostrada
    },
  },
};
</script>

<style scoped>
/* Estilos opcionales para el modal */
/* Estilos para el modal */
.custom-modal-popup {
  height: 500px !important; /* Altura fija del modal */
}

.custom-modal-container {
  display: flex;
  flex-direction: column;
}

/* Estilos para los elementos dentro del modal */
#searchInput {
  margin-bottom: 10px;
}

#productListContainer {
  flex-grow: 1;
  overflow-y: auto;
}

#productList li {
  padding: 5px;
  border-bottom: 1px solid #eee;
}

#productList li:hover {
  background-color: #f0f0f0;
}

/* Estilos para los botones de navegación */
#prevBtn, #nextBtn {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

#prevBtn:hover, #nextBtn:hover {
  background-color: #0056b3;
}
</style>