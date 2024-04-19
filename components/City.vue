<template>
  <a
    href="javascript:void(0)"
    class="absolute flex flex-col items-center justify-start"
    :style="{ top: city.y + 'px', left: city.x + 'px' }"
    @click="handleCity"
  >
    <div
      class="w-4 h-4 border-2 border-red-600"
      :style="{ backgroundColor: city.faction.color }"
    ></div>
    <div>{{ city.name }}</div>
  </a>
</template>

<script setup>
import { ModalCityInfo } from "#components";

const modal = useModal();
const game = useGame();

const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
});

const handleCity = () => {
  if (game.state == "NORMAL") {
    modal.open(ModalCityInfo, {
      city: props.city,
    });
  } else if (game.state == "CITY_SELECT") {
    game.moveSelectCity(props.city);
    game.move();
  }
};
</script>
