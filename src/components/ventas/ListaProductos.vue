<template>
  <div>
    <table class="table table-striped">
      <thead>
      <tr>
        <th class="th-codigo">Código</th>
        <th>Nombre</th>
        <th>Precio</th>
        <th>Cantidad</th>
        <th>Subtotal</th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="(product, index) in productos"
          :key="index"
          :class="{ 'selected-row': index === selectedIndex }"
      >
        <td class="td-codigo">{{ product.codigo }}</td>
        <td>{{ product.nombre }}</td>
        <td>{{ product.precio }}</td>
        <td>
          <input
              type="number"
              class="cantidad"
              v-model.number="product.cantidad"
              @input="$emit('actualizar-producto', index, product.cantidad)"
              :min="1"
              @click="selectProduct(index)"
          />
        </td>
        <td>{{ product.subtotal }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import './ListaProductos.css';

export default {
  props: {
    productos: Array,
  },
  data() {
    return {
      selectedIndex: 0,
    };
  },
  watch: {
    productos(newVal, oldVal) {
      if (newVal.length > oldVal.length) {
        // Establece selectedIndex en el último producto agregado y usa nextTick para asegurar el cambio visual
        this.$nextTick(() => {
          this.selectedIndex = newVal.length - 1;
        });
      }
    },
  },
  methods: {
    selectNext() {
      if (this.selectedIndex < this.productos.length - 1) {
        this.selectedIndex++;
      }
    },
    selectPrevious() {
      if (this.selectedIndex > 0) {
        this.selectedIndex--;
      }
    },
    selectProduct(index) {
      this.selectedIndex = index;
      this.openModal();
    },
    handleKeyDown(event) {
      if (event.key === 'ArrowDown') {
        this.selectNext();
      } else if (event.key === 'ArrowUp') {
        this.selectPrevious();
      } else if (event.key === '*') {
        event.preventDefault();
        this.openModal();
      } else if (event.key === 'Delete') {
        event.preventDefault();
        this.deleteProduct();
      }
    },
    openModal() {
      const product = this.productos[this.selectedIndex];
      Swal.fire({
        title: 'Ingresa la nueva cantidad',
        input: 'number',
        inputValue: product.cantidad,
        inputAttributes: {
          min: 1,
        },
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Cancelar',
        preConfirm: (inputValue) => {
          const parsedQuantity = parseInt(inputValue, 10);
          if (!isNaN(parsedQuantity) && parsedQuantity > 0) {
            product.cantidad = parsedQuantity;
            product.subtotal = product.precio * parsedQuantity;
            this.$emit('actualizar-producto', this.selectedIndex, product.cantidad);
            return true;
          } else {
            Swal.showValidationMessage('Por favor ingresa una cantidad válida');
            return false;
          }
        }
      }).then(() => {});
      setTimeout(() => {
        const inputElement = document.querySelector('.swal2-input');
        if (inputElement) {
          inputElement.select();
        }
      }, 100);
    },
    deleteProduct() {
      if (this.productos.length > 0 && this.selectedIndex >= 0) {
        this.$emit('eliminar-producto', this.selectedIndex);
        if (this.selectedIndex >= this.productos.length) {
          this.selectedIndex = this.productos.length - 1;
        } else if (this.productos.length === 0) {
          this.selectedIndex = -1;
        }
      }
    },
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeyDown);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  },
};
</script>

<style scoped>
/* Ajuste del ancho específico para las columnas */
th:nth-child(1), td:nth-child(1) {
  width: 15%;
}

th:nth-child(2), td:nth-child(2) {
  width: 40%;
}

th:nth-child(3), td:nth-child(3) {
  width: 8%;
}

th:nth-child(4), td:nth-child(4) {
  width: 10%;
}

th:nth-child(5), td:nth-child(5) {
  width: 5%;
}
</style>
