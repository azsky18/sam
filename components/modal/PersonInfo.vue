<template>
  <UModal :overlay="false">
    <div class="p-4">
      <div class="w-[100px] h-[100px] bg-slate-400">사진</div>
      <div>{{ person.name }}</div>
      <div>소재 : {{ person.location.name }}</div>
      <div>위신 : {{ person.prestige }}</div>
      <div class="mt-10">
        <div class="flex gap-2">
          <a href="javascript:void(0)">상세정보</a>
          <a
            href="javascript:void(0)"
            @click="move"
            v-if="game.playerFaction.id == person.faction.id"
            >이동</a
          >
        </div>
      </div>
    </div>
  </UModal>
</template>

<script setup>
const modal = useModal();
const game = useGame();

const props = defineProps({
  person: {
    type: Object,
    required: true,
  },
});

const move = () => {
  modal.close();
  game.moveSelectPerson(props.person);
};
</script>
