<template>
  <div class="max-w-full overflow-x-hidden ">
    <slot />
    <Footer />
  </div>
</template>
<script setup lang="ts">
import Footer from '~/components/layout/footer.vue';
</script>
