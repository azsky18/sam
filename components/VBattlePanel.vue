<template>
  <div>
    <ul>
      <li>지휘관 : 조운</li>
      <li>병종 : 창</li>
      <li>병력 : {{ showUnit?.amount ?? "-" }}</li>
      <li>
        활동력 : {{ showUnit?.actionPoint }}
        {{ useActionPoint > 0 ? `(-${useActionPoint})` : "" }}
      </li>
    </ul>
    <UButton @click="battleGame.passTurn()">Pass Turn</UButton>
  </div>
</template>

<script setup>
const battleGame = useBattleGame();

const showUnit = computed(() => {
  if (battleGame.hoverTile && battleGame.hoverTile.isLocateUnit) {
    return battleGame.hoverTile.locateUnit;
  } else {
    return battleGame.selectedUnit;
  }
});

const useActionPoint = computed(() => {
  const hoverTile = battleGame.hoverTile;

  if (battleGame.state == "UNIT_SELECT") {
    if (hoverTile && hoverTile.state == "ENABLE_MOVE") {
      const target = battleGame.selectedUnit;
      const unitTile = target.tile;
      return unitTile.distance(hoverTile);
    }
  }

  return 0;
});
</script>
