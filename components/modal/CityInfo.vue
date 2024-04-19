<template>
  <UModal :overlay="false">
    <div class="p-4">
      <div>{{ city.name }}</div>
      <ul>
        <li v-for="person in city.persons" class="flex gap-5">
          <span>{{ person.name }}</span>
          <div class="flex gap-2">
            <a href="javascript:void(0)" @click="showModalPersonInfo(person)"
              >상세정보</a
            >
            <a
              href="javascript:void(0)"
              @click="movePerson(person)"
              v-if="game.playerFaction.id == person.faction.id"
              >이동</a
            >
          </div>
        </li>
      </ul>
    </div>
  </UModal>
</template>

<script setup>
import { ModalPersonInfo } from "#components";

const modal = useModal();
const game = useGame();

const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
});

const showModalPersonInfo = (person) => {
  modal.close();
  setTimeout(() => {
    modal.open(ModalPersonInfo, {
      person,
    });
  }, 0);
};

const movePerson = (person) => {
  modal.close();
  game.moveSelectPerson(person);
};
</script>
