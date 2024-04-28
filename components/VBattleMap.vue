<template>
  <a href="javascript:void(0)" class="w-[1280px] h-[1024px] bg-slate-600 absolute" ref="element">
    <div class="relative">
      <VBattleTile v-for="tile in map.tiles1d" :tile="tile" />
      <VBattleUnit v-for="unit in units" :unit="unit" />

      <template v-for="ani in animations.items">
        <VSpriteAnimation v-if="ani.run" :img="ani.img" :width="ani.width" :height="ani.height" :vCount="ani.vCount"
          :hCount="ani.hCount" :time="ani.time" :x="ani.x" :y="ani.y" />
      </template>

      <UContextMenu v-model="contextMenu.isOpen" :virtual-element="contextMenu.virtualElement">
        <div class="p-4">
          <ul v-for="menuItem in contextMenu.menuItems">
            <li>
              <a href="javascript:void(0)" @click="menuItem.onClick(); contextMenu.close();">{{ menuItem.label }}</a>
            </li>
          </ul>
        </div>
      </UContextMenu>
    </div>
  </a>

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

const contextMenu = useContextMenu();

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
