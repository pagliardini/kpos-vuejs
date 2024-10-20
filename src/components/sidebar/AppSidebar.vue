<template>
  <div class="h-screen w-60 bg-gray-800 text-white flex flex-col">
    <div class="p-4 text-2xl font-bold border-b border-gray-700">
      KPOS Vue
    </div>
    <nav class="flex-1">
      <ul>
        <li class="p-4 hover:bg-gray-700 cursor-pointer">
          <router-link to="/productos">Productos</router-link>
        </li>
        <li class="p-4 hover:bg-gray-700 cursor-pointer">
          <router-link to="/ventas">Ventas</router-link>
        </li>
        <li class="p-4 hover:bg-gray-700 cursor-pointer">
          <router-link to="/compras">Compras</router-link>
        </li>
        <li class="p-4 hover:bg-gray-700 cursor-pointer">
          <router-link to="/caja">Caja</router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'AppSidebar',
}
</script>
