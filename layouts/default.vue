<template>
  <div class="max-w-full overflow-x-hidden ">
    <Header />
    <slot />
    <Footer />
  </div>
</template>
<script setup lang="ts">
import Footer from '~/components/layout/footer.vue';
import Header from '~/components/layout/header.vue';
</script>
