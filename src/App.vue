<template>
  <div class="flex">
    <AppSidebar />
    <div class="flex-1 p-6">
      <router-view /> <!-- Asegúrate de que esto esté presente -->
    </div>
  </div>
</template>

<script>
import AppSidebar from './components/sidebar/AppSidebar.vue';

export default {
  name: 'App',
  components: {
    AppSidebar,
  },
}
</script>
