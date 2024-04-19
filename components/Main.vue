<template>
  <div class="w-screen h-screen flex flex-row">
    <FactionPanel />
    <PlayMap :game="game" />
    <UButton @click="game.passTurn()">Pass Turn</UButton>
  </div>
</template>

<script setup>
const game = useGame();
</script>
