<template>
  <div class="bg-slate-400 w-[400px] h-full">
    <div>턴 : {{ game.turn }}</div>
    <div>{{ faction.name }}</div>
    <div class="p-2">
      <h5>리더</h5>
      <ul>
        <li v-for="leader in faction.leaders">
          <a
            herf="javascript:void(0)"
            class="cursor-pointer"
            @click="showPersonInfoModal(leader)"
            >{{ leader.name }}</a
          >
        </li>
      </ul>
    </div>
    <div class="p-2">
      <h5>장수</h5>
      <ul>
        <li v-for="person in faction.persons">
          <a
            herf="javascript:void(0)"
            class="cursor-pointer"
            @click="showPersonInfoModal(person)"
            >{{ person.name }} // {{ person.prestige }} //
            {{ person.influence }}</a
          >
        </li>
      </ul>
    </div>

    <div class="p-2">
      <h5>군단</h5>
      <ul>
        <li v-for="corps in faction.corps" class="flex gap-5">
          <a
            herf="javascript:void(0)"
            class="cursor-pointer"
            @click="showCorpsInfoModal(corps)"
            >{{ corps.name }}</a
          >
          <div>{{ corps.amount }}</div>
          <div>{{ corps.moral }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ModalPersonInfo, ModalCorpsInfo } from "#components";

const game = useGame();
const modal = useModal();

const faction = game.playerFaction;

const showPersonInfoModal = (person) => {
  modal.open(ModalPersonInfo, {
    person,
  });
};

const showCorpsInfoModal = (corps) => {
  modal.open(ModalCorpsInfo, {
    corps,
  });
};
</script>
