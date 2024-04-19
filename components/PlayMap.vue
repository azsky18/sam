<template>
  <div
    class="relative bg-[url(assets/img/map.png)] bg-auto bg-left-top bg-no-repeat w-[1024px] h-[800]px"
  >
    <City v-for="city in game.cities" :city="city" />
  </div>
</template>

<script setup>
const props = defineProps({
  game: {
    type: Object,
    required: true,
  },
});
</script>
