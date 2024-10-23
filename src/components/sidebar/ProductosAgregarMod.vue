<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Seleccione una Marca</h1>
    <div class="mb-4">
      <label for="marca_id" class="block text-sm font-medium text-gray-700">Marca</label>
      <select v-model="selectedMarca" id="marca_id" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
        <option value="">Seleccione una marca</option>
        <option v-for="marca in marcas" :key="marca.id" :value="marca.id">{{ marca.nombre }}</option>
      </select>
    </div>

    <button @click="submitMarca" class="w-full py-2 px-4 bg-blue-600 text-white rounded">Guardar Selección</button>
  </div>
</template>

<script>
export default {
  name: 'SelectMarca',
  data() {
    return {
      selectedMarca: null, // Almacena la marca seleccionada
      marcas: [], // Aquí se almacenarán las marcas obtenidas del backend
    };
  },
  methods: {
    async fetchData() {
      try {
        const response = await fetch('http://localhost:5000/marcas'); // URL actualizada

        if (!response.ok) {
          throw new Error('Error al cargar marcas');
        }

        this.marcas = await response.json();
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    },
    submitMarca() {
      if (this.selectedMarca) {
        alert(`Marca seleccionada: ${this.selectedMarca}`);
        // Aquí puedes agregar la lógica para manejar la selección de la marca
      } else {
        alert('Por favor, seleccione una marca.');
      }
    },
  },
  mounted() {
    this.fetchData(); // Cargar datos de marcas al montar el componente
  },
};
</script>

<style scoped>
/* Puedes agregar estilos personalizados aquí */
</style>