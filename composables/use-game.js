import Game from "~/classes/Game.js";

let game;
const useGame = () => {
  if (!game) {
    game = reactive(new Game());
  }
  return game;
};

export { useGame };
