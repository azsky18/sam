export default class Animation {
  img;
  x;
  y;
  width;
  height;
  vCount;
  hCount;
  loop;
  time;
  run;

  constructor(img, width, height, vCount, hCount, loop, time) {
    this.img = img;
    this.width = width;
    this.height = height;
    this.vCount = vCount;
    this.hCount = hCount;
    this.loop = loop;
    this.time = time;
    this.run = false;
  }
}
