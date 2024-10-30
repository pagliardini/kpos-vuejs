<template>
    <table class="table table-striped">
      <thead>
      <tr>
        <th>Código</th>
        <th>Nombre</th>
        <th>Precio</th>
        <th>Cantidad</th>
        <th>Subtotal</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(product, index) in productos" :key="index">
        <td>{{ product.codigo }}</td>
        <td>{{ product.nombre }}</td>
        <td>{{ product.precio }}</td>
        <td>
          <input
              type="number"
              class="form-control"
              v-model.number="product.cantidad"
              @input="$emit('actualizar-producto', index, product.cantidad)"
              :min="1"
          />
        </td>
        <td>{{ product.subtotal }}</td>
      </tr>
      </tbody>
    </table>
</template>

<script>

import './ListaProductos.css'

export default {
  props: {
    productos: Array
  }
};
</script>
