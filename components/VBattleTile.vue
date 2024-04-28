<template>
  <div ref="tileRef" class="tile w-[50px] h-[50px] border-[1px] border-red-50 absolute" :style="{
    top: (tile.y * tile.size) + 'px',
    left: (tile.x * tile.size) + 'px'
  }" :class="{
    'bg-black': ['DISABLE', 'NORMAL'].includes(tile.state),
    'bg-gray-200': ['ENABLE_MOVE'].includes(tile.state),
    /*'bg-red-100': tile.isZoc,*/
    'bg-red-400': ['ENABLE_ATTACK'].includes(tile.state),
  }" @mousedown.left="selectTile" @mousedown.right="cancelTile" @mouseover="hoverTile" @contextmenu.prevent>
    <div class="relative">
      <span class="absolute top-0 right-1 text-xs">({{ tile.x }}, {{ tile.y }})</span>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tile: {
    type: Object,
    required: true,
  },
});

const tileRef = ref();

const battleGame = useBattleGame();
const contextMenu = useContextMenu();

const hoverTile = () => {
  battleGame.hoverTile = props.tile;
  battleGame.hoverTile.handleHover();
};

const selectTile = () => {
  props.tile.select();
};

const cancelTile = (e) => {
  if (battleGame.state != 'NORMAL') {
    battleGame.toNormalState();
  } else {
    contextMenu.open([
      {
        label: '이동',
        onClick: () => {
          console.log('이동을 클릭')
        }
      },
      {
        label: '분할',
        onClick: () => {
          console.log('분할을 클릭')
        }
      }
    ]);
  }
};

onMounted(() => {
  props.tile.el = tileRef.value;
});
</script>
