export default class BattleTeam {
  battleGame;
  id;
  name;
  color;
  isPlayerTeam;

  constructor(id, name, color, isPlayerTeam) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.isPlayerTeam = isPlayerTeam;
  }

  get units() {
    return this.battleGame.units.filter((unit) => unit.team.id == this.id);
  }
}
