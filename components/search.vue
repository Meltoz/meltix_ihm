<script setup lang="ts">
import { Search } from 'lucide-vue-next';

const { q } = usePagination();

const searchInput = ref<string>(q.value);

const search = () => {
  q.value = searchInput.value;
};

watch(q, (newValue) => {
  searchInput.value = newValue
})
</script>

<template>
  <div class="w-3/8 flex justify-end h-fit group group-hover:w-6/12 relative">
    <input
      v-model="searchInput"
      class="w-32 hover:w-full group-hover:w-full focus:w-full rounded-full px-3 py-1 text-lg font-inter border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
      @keyup.enter="search"
    />
    <button
      @click="search"
      class="cursor-pointer absolute right-0.5 top-0.5 p-1 bg-white hover:bg-gray-100 rounded-full"
    >
      <Search class="size-6 text-gray-300 group-hover:text-blue-500/50" />
    </button>
  </div>
</template>