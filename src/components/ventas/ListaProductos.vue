<template>
  <table class="min-w-full">
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
    <tr v-for="(producto, index) in productos" :key="index">
      <td>{{ producto.codigo }}</td>
      <td>{{ producto.nombre }}</td>
      <td>${{ producto.precio }}</td>
      <td>1</td>
      <td></td>
    </tr>
    </tbody>
  </table>
</template>

<script>
import './ListaProductos.css'

export default {
  props: {
    productos: {
      type: Array,
      required: true
    }
  }
}
</script>