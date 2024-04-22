<template>
  <a href="javascript:void(0)" class="w-[1280px] h-[1024px] bg-slate-600 absolute" ref="element">
    <div v-for="row in map.tiles2d" class="flex">
      <VBattleTile v-for="tile in row" :tile="tile">
        <!--
        <VBattleUnit v-if="tile.isLocateUnit" :unit="tile.locateUnit" />
        -->
      </VBattleTile>
    </div>
    <VBattleUnit v-for="unit in units" :unit="unit" />
  </a>
</template>

<script setup>
const element = ref(null);

const props = defineProps({
  map: {
    type: Object,
    required: true,
  },
  units: {
    type: Array,
    required: true,
  }
});

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
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

    if (pos1 == 0 && pos2 == 0)  {
      handleClick(e);
    }
  }
}

function handleClick(e) {
}

onMounted(() => {
  dragElement(element.value);
});
</script>
