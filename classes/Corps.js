export default class Corps {
  game;
  id;
  name;
  origin;
  commander;
  moral;
  amount;
  location;

  constructor(game, id, name, origin, commander, moral, amount, location) {
    this.game = game;
    this.id = id;
    this.name = name;
    this.origin = origin;
    this.commander = commander;
    this.moral = moral;
    this.amount = amount;
    this.location = location;
  }

  get faction() {
    if (this.origin.constructor.name == "Faction") {
      return this.origin;
    } else {
      return this.origin.faction;
    }
  }

  get originType() {
    return this.origin.constructor.name;
  }

  destroy() {
    const index = this.game.corps.findIndex((c) => c.id == this.id);
    this.game.corps.splice(index, 1);
  }
}
