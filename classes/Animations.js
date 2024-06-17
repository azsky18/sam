import Animation from "./Animation.js";

export default class Animations {
  items;

  constructor() {
    this.items = [
      new Animation("/assets/img/sprite/explosion.png", 50, 50, 5, 5, 1, 0.2),
    ];
  }

  runAnimation(target, x, y) {
    return new Promise((resolve) => {
      target.x = x;
      target.y = y;
      target.run = true;

      setTimeout(() => {
        target.run = false;
        resolve("resolved");
      }, target.time * 1000);
    });
  }

  async explosion(x, y) {
    return this.runAnimation(this.items[0], x, y);
  }

  async move(object, x, y) {
    //object.el
  }
}
