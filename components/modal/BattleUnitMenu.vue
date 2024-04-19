<template>
  <UModal :overlay="false">
    <div class="p-4">
      <div>병력 : {{ unit.amount }}</div>
      <div>행동력 : {{ unit.actionPoint }} &#47; {{ unit.maxActionPoint }}</div>
    </div>
  </UModal>
</template>

<script setup>
const modal = useModal();

const props = defineProps({
  unit: {
    type: Object,
    required: true,
  },
});

props.unit.battleGame.state = "UNIT_MOVE";
props.unit.battleGame.selectedUnit = props.unit;

props.unit.battleGame.map.tiles.forEach((tile) => (tile.state = "DISABLE"));
props.unit.getMoveableTiles().forEach((tile) => (tile.state = "ENABLE_MOVE"));
</script>
