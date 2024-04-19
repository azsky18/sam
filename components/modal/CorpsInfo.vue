<template>
  <UModal :overlay="false">
    <div class="p-4">
      <div>{{ corps.name }}</div>
      <div>소재 : -</div>
      <div>소속 : {{ corps.faction.name }}</div>
      <div>지휘관 : {{ corps.commander.name }}</div>
      <div>병력 : {{ corps.amount }}</div>
      <div>사기 : {{ corps.moral }}</div>
      <div class="mt-10">
        <div class="flex gap-2">
          <a
            href="javascript:void(0)"
            @click="battle"
            v-if="game.playerFaction.id == corps.faction.id"
            >출병</a
          >
        </div>
      </div>
    </div>
  </UModal>
</template>

<script setup>
import Battle from "~/classes/Battle.js";

const modal = useModal();
const game = useGame();

const props = defineProps({
  corps: {
    type: Object,
    required: true,
  },
});

const battle = () => {
  modal.close();

  const battle = new Battle(game.corps[0], game.corps[2]);
  battle.run();
};
</script>
