<template></template>

<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  faction: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
});
</script>
