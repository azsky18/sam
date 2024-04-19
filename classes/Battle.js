export default class Battle {
  game;
  // id;
  // name;
  corps1;
  corps2;
  // faction;

  constructor(corps1, corps2) {
    this.corps1 = corps1;
    this.corps2 = corps2;
  }

  run() {
    console.log(this.corps1.name + "과 " + this.corps2.name + "가 전투함");
    this.corps2.destroy();
    console.log(this.corps2.name + "가 괴멸함");
  }
}
