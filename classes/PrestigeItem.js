export default class PrestigeItem {
  game;
  id;
  name;
  score;
  age;

  constructor(game, id, name, score, age) {
    this.game = game;
    this.id = id;
    this.name = name;
    this.score = score;
    this.age = age;
  }

  minusAge(amount) {
    this.age -= amount;
  }

  get isExpired() {
    return age < 0;
  }
}
