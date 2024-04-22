<template>
  <div
    class="fixed top-[10px] left-[10px] w-[150px] h-[100px] z-10 bg-slate-200 text-slate-950 p-2"
  >
    <span>{{ battleGame.turn }}턴 / {{ battleGame.turnTeam?.name }}차례</span>
    <div
      v-for="team in battleGame.teams"
      class="flex items-center justify-start gap-1"
    >
      <div class="w-5 h-5" :style="{ backgroundColor: team.color }"></div>
      <span>{{ team.name }}</span>
    </div>
  </div>

  <div class="h-screen relative w-[calc(100%-200px)] overflow-hidden">
    <VBattleMap :map="battleGame.map" :units="battleGame.units" />

    <template v-for="ani in animations.items">
      <VSpriteAnimation
        v-if="ani.run"
        :img="ani.img"
        :width="ani.width"
        :height="ani.height"
        :vCount="ani.vCount"
        :hCount="ani.hCount"
        :time="ani.time"
        :x="ani.x"
        :y="ani.y"
      />
    </template>
  </div>

  <VBattlePanel
    class="absolute top-0 right-0 bg-slate-500 h-screen w-[200px]"
  />

  <UModals />
</template>

<script setup>
const battleGame = useBattleGame();
const animations = useAnimations();
battleGame.animations = animations;
</script>
