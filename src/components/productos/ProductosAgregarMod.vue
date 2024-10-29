<template>
    <h1 class="text-2xl font-bold mb-4">Agregar o Modificar Producto</h1>
    <form @submit.prevent="submitForm">
      <!-- Código, Nombre, Precio, Costo -->

      <div class="relative z-0 w-full mb-5 group">
        <input type="text" v-model="producto.codigo" id="codigo" requiered class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
        <label for="codigo" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Codigo</label>
      </div>
      <div class="relative z-0 w-full mb-5 group">
        <input type="text" v-model="producto.nombre" id="nombre" requiered class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
        <label for="nombre" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Nombre</label>
      </div>
      <div class="relative z-0 w-full mb-5 group">
        <input type="number" v-model="producto.precio" id="precio" requiered class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
        <label for="precio" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Precio</label>
      </div>


      <div class="mb-4">
        <label for="costo" class="block text-sm font-medium text-gray-700">Costo</label>
        <input type="number" v-model.number="producto.costo" id="costo" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"/>
      </div>

      <!-- Selector de Marca -->
      <div class="mb-4">
        <label for="marca_id" class="block text-sm font-medium text-gray-700">Marca</label>
        <select v-model="producto.marca_id" id="marca_id" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
          <option value="">Seleccione una marca</option>
          <option v-for="marca in marcas" :key="marca.id" :value="marca.id">{{ marca.nombre }}</option>
        </select>
      </div>
      <div class="mb-4">
        <label for="marca_id" class="block text-sm font-medium text-gray-700">Rubro</label>
        <select v-model="producto.rubro_id" id="marca_id" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
          <option value="">Seleccione un Rubro</option>
          <option v-for="rubro in rubros" :key="rubro.id" :value="rubro.id">{{ rubro.nombre }}</option>
        </select>
      </div>
      <div class="mb-4">
        <label for="marca_id" class="block text-sm font-medium text-gray-700">Tipo</label>
        <select v-model="producto.tipo_id" id="marca_id" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
          <option value="">Seleccione un Tipo</option>
          <option v-for="tipo in tipos" :key="tipo.id" :value="tipo.id">{{ tipo.nombre }}</option>
        </select>
      </div>

      <!-- Botón para guardar -->
      <button type="submit" class="w-full py-2 px-4 bg-blue-600 text-white rounded">Guardar Producto</button>
    </form>
</template>

<script>
export default {
  name: 'ProductosAgregarMod',
  data() {
    return {
      producto: {
        codigo: '',
        nombre: '',
        precio: null,
        costo: null,
        marca_id: null,
        rubro_id: null,
        tipo_id: null,
      },
      marcas: [],
      rubros: [],
      tipos: [],
    };
  },
  methods: {
    async submitForm() {
      try {
        const response = await fetch('http://localhost:5000/productos/agregar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.producto),
        });

        if (!response.ok) {
          const errorText = await response.text(); // texto de error
          throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        alert(data.message); //
        this.resetForm(); // Reiniciar el formulario después de agregar el producto
      } catch (error) {
        console.error('Error al agregar producto:', error);
        alert(error.message); // Muestra el mensaje de error
      }
    },
    async fetchData() {
      try {
        const [marcasResponse, rubrosResponse, tiposResponse] = await Promise.all([
          fetch('http://localhost:5000/marcas'),
          fetch('http://localhost:5000/rubros'),
          fetch('http://localhost:5000/tipos'),
        ]);

        if (!marcasResponse.ok || !rubrosResponse.ok || !tiposResponse.ok) {
          throw new Error('Error al cargar marcas o rubros');
        }

        this.marcas = await marcasResponse.json();
        this.rubros = await rubrosResponse.json();
        this.tipos  = await tiposResponse.json();
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    },
    resetForm() {
      this.producto = {
        codigo: '',
        nombre: '',
        precio: null,
        costo: null,
        marca_id: null,
        rubro_id: null,
        tipos_id: null,
      };
    },
  },
  mounted() {
    this.fetchData(); // Cargar datos de marcas al cargar el componente
  },
};
</script>

<style scoped>
</style>