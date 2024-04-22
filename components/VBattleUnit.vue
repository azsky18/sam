<template>
  <div v-if="unit.realPosition" class="absolute w-[50px] h-[50px] transition-all duration-100 pointer-events-none" :style="{
    top: unit.realPosition.y + 'px',
    left: unit.realPosition.x + 'px'
  }" ref="unitRef">
    <div
      class="unit-shape w-[15px] ml-px absolute top-[5px]"
      :style="{
        transform: `rotate(${rotate}deg)`,
        'border-bottom': `34px solid ${unit.color}`,
      }"
    ></div>
    <span
      class="absolute w-full text-center ml-[-1px]"
      :class="{
        'bottom-0': unit.direction != 'BOTTOM',
        'top-0': unit.direction == 'BOTTOM',
      }"
      >{{ unit.amount }}</span
    >
  </div>
</template>

<script setup>
const props = defineProps({
  unit: {
    type: Object,
    required: true,
  },
});

const unitRef = ref();

const rotate = computed(() => {
  const direction = props.unit.direction;
  if (direction == "TOP") {
    return 0;
  } else if (direction == "BOTTOM") {
    return 180;
  } else if (direction == "RIGHT") {
    return 90;
  } else if (direction == "LEFT") {
    return 270;
  } else {
    console.log("Illegal Direction", direction);
  }
});

onMounted(() => {
  props.unit.el = unitRef.value;
});
</script>

<style>
.unit-shape {
  border-top: 0px solid transparent;
  border-left: 24.5px solid transparent;
  border-right: 24.5px solid transparent;
}
</style>
