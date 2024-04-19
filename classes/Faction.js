export default class Faction {
  game;

  id;
  color;

  constructor(game, id, color) {
    this.game = game;
    this.id = id;
    this.color = color;
  }

  get name() {
    return this.leaders.map((l) => l.name).join(",") + "군";
  }

  get persons() {
    return this.game.persons
      .filter((p) => p.faction.id == this.id)
      .sort((p1, p2) => {
        return p2.prestige - p1.prestige;
      });
  }

  get leaders() {
    return this.persons.filter((p) => p.isLeader);
  }

  get corps() {
    return this.game.corps.filter((c) => c.faction.id == this.id);
  }
}
