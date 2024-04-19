export default class City {
  game;
  id;
  name;
  x;
  y;
  faction;

  constructor(game, id, name, x, y, faction) {
    this.game = game;
    this.id = id;
    this.name = name;
    this.x = x;
    this.y = y;
    this.faction = faction;
  }

  get persons() {
    return this.game.persons.filter((p) => p.location.id == this.id);
  }
}
