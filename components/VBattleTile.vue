<template>
  <a
    href="javascript:void(0)"
    ref="thisTile"
    class="w-[50px] h-[50px] border-[1px] border-red-50 relative"
    :class="{
      'bg-black': ['DISABLE', 'NORMAL'].includes(tile.state),
      'bg-gray-200': ['ENABLE_MOVE'].includes(tile.state),
      'bg-red-400': ['ENABLE_ATTACK'].includes(tile.state),
    }"
    @mousedown.left="selectTile"
    @mousedown.right="cancelTile"
    @mouseover="hoverTile"
    @contextmenu.prevent
  >
    <span class="absolute top-0 right-1 text-xs"
      >({{ tile.x }}, {{ tile.y }})</span
    >
    <slot></slot>
  </a>
</template>

<script setup>
const props = defineProps({
  tile: {
    type: Object,
    required: true,
  },
});

const thisTile = ref();

const battleGame = useBattleGame();
const animations = useAnimations();

const hoverTile = () => {
  battleGame.hoverTile = props.tile;

  // 유닛 방향 미리보기
  if (battleGame.state == "UNIT_MOVE") {
    if (battleGame.hoverTile.y < battleGame.selectedUnit.y) {
      // 위에 있으면
      // AI도 적용하기 위해서는 이동방향에 따라...
      battleGame.selectedUnit.direction = "TOP";
    } else if (battleGame.hoverTile.y > battleGame.selectedUnit.y) {
      battleGame.selectedUnit.direction = "BOTTOM";
    } else if (battleGame.hoverTile.x > battleGame.selectedUnit.x) {
      battleGame.selectedUnit.direction = "RIGHT";
    } else if (battleGame.hoverTile.x < battleGame.selectedUnit.x) {
      battleGame.selectedUnit.direction = "LEFT";
    }
  }
};

const selectTile = () => {
  if (battleGame.state == "UNIT_INFO") {
    battleGame.toNormalState();
    return;
  }

  if (battleGame.state == "NORMAL") {
    if (props.tile.isLocateUnit) {
      const unit = props.tile.locateUnit;

      if (unit.actionPoint <= 0) {
        console.log("활동력이 없음");
        return;
      }

      if (unit.team.id == battleGame.playerTeam.id) {
        battleGame.state = "UNIT_MOVE";
        battleGame.selectedUnit = unit;

        battleGame.map.tiles.forEach((tile) => (tile.state = "DISABLE"));
        unit.getMoveableTiles().forEach((tile) => (tile.state = "ENABLE_MOVE"));
        unit
          .getAttackableTiles()
          .forEach((tile) => (tile.state = "ENABLE_ATTACK"));
      } else {
        battleGame.state = "UNIT_INFO";
        battleGame.selectedUnit = unit;

        battleGame.map.tiles.forEach((tile) => (tile.state = "DISABLE"));
        unit.getMoveableTiles().forEach((tile) => (tile.state = "ENABLE_MOVE"));
        unit
          .getAttackableTiles()
          .forEach((tile) => (tile.state = "ENABLE_ATTACK"));
      }
    }
  } else if (battleGame.state == "UNIT_MOVE") {
    if (props.tile.state == "ENABLE_ATTACK") {
      const attacker = battleGame.selectedUnit;
      const defender = props.tile.locateUnit;
      attacker.attackTo(defender);
    } else if (props.tile.state == "ENABLE_MOVE") {
      const tile = props.tile;
      const selectedUnit = battleGame.selectedUnit;
      selectedUnit.moveTo(tile.x, tile.y);

      battleGame.toNormalState();
    }
  }
};

const cancelTile = () => {
  battleGame.toNormalState();
};

onMounted(() => {
  props.tile.el = thisTile.value;
});
</script>
