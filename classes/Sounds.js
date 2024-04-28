export default class Sound {
  items;
  audios;

  constructor() {
    this.items = ["/_nuxt/assets/sound/slash.mp3"];

    this.audios = this.items.map((item) => {
      const arr = [];
      for (let i = 0; i < 5; i++) {
        const audio = new Audio(item);
        audio.addEventListener("ended", function () {
          this.load();
          this.pause();
        });
        arr.push(audio);
      }

      return arr;
    });
  }

  play(index) {
    this.audios[index].find((audio) => audio.paused).play();
  }

  slash() {
    this.play(0);
  }
}
