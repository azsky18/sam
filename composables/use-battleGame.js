import BattleGame from "~/classes/BattleGame.js";

let battleGame;
const useBattleGame = () => {
  if (!battleGame) {
    battleGame = reactive(new BattleGame());
  }
  return battleGame;
};

export { useBattleGame };
