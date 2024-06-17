<template>
  <div class="w-[1280px] h-[1024px] bg-slate-600 absolute" ref="element">
    <div class="relative">
      <VBattleTile v-for="tile in map.tiles1d" :tile="tile" />
      <VBattleUnit v-for="unit in units" :unit="unit" />

      <!-- 타일 인포 -->
      <!--
      <div v-if="hoverTile" class="absolute w-[200px] h-[200px] bg-black border border-slate-50 pointer-events-none"
        :style="{ top: (hoverTile?.realPosition.y - 25) + 'px', left: (hoverTile?.realPosition.x + hoverTile?.size + 75) + 'px' }">
        <div v-if="selectedUnit">
          <ul>
            <li>지휘관 : 조운</li>
            <li>병종 : 창</li>
            <li>병력 : {{ selectedUnit?.amount ?? "-" }}</li>
            <li>
              활동력 : {{ selectedUnit?.actionPoint }}
              {{ useActionPoint > 0 ? `(-${useActionPoint})` : "" }}
            </li>
          </ul>
        </div>
        <div>
          <h5>지형</h5>
          <p>Move Point : {{ hoverTile.movePoint }}</p>
          <p>ZOC : {{ hoverTile.isZoc }}</p>
        </div>
      </div>
      -->

      <template v-for="ani in animations.items">
        <VSpriteAnimation v-if="ani.run" :img="ani.img" :width="ani.width" :height="ani.height" :vCount="ani.vCount"
          :hCount="ani.hCount" :time="ani.time" :x="ani.x" :y="ani.y" />
      </template>

      <UContextMenu v-model="contextMenu.isOpen" :virtual-element="contextMenu.virtualElement">
        <div class="p-4">
          <div>
            <h5>지형</h5>
            <p>Move Point : {{ contextMenu.contents.tile.movePoint }}</p>
          </div>
          <template v-if=contextMenu.contents.menu>
            <UDivider />
            <ul v-for="menuItem in contextMenu.contents.menu">
              <li>
                <ULink @click="menuItem.onClick(); contextMenu.close();">{{ menuItem.label }}</ULink>
              </li>
            </ul>
          </template>
        </div>
      </UContextMenu>
    </div>
  </div>
</template>

<script setup>
const element = ref();

const props = defineProps({
  map: {
    type: Object,
    required: true,
  },
  units: {
    type: Array,
    required: true,
  },
  animations: {
    type: Object,
    required: true,
  }
});

const battleGame = useBattleGame();
const contextMenu = useContextMenu();
const hoverTile = computed(() => battleGame.hoverTile);
const selectedUnit = computed(() => battleGame.selectedUnit);
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

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0,
    nowDrag = false;
  if (document.getElementById(elmnt.id + "header")) {
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    if (e.button != 0) {
      return;
    }

    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    nowDrag = true;
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement(e) {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

onMounted(() => {
  dragElement(element.value);
});
</script>
