import Animations from "~/classes/Animations.js";

let animations;
const useAnimations = () => {
  if (!animations) {
    animations = reactive(new Animations());
  }
  return animations;
};

export { useAnimations };
