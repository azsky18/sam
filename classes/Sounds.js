export default class Sound {
  items;

  constructor() {
    this.items = [new Audio("/_nuxt/assets/sound/slash.mp3")];
  }

  slash() {
    this.items[0].play();
  }
}
