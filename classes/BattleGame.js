import BattleMap from "~/classes/BattleMap.js";
import BattleTeam from "~/classes/BattleTeam.js";
import BattleUnit from "~/classes/BattleUnit.js";
import BattleAi from "~/classes/BattleAi.js";

export default class BattleGame {
  map;
  teams;
  units;

  state;
  selectedUnit;
  hoverTile;

  turn;
  turnTeam;

  ai;
  animations;

  constructor() {
    this.map = new BattleMap(25, 25);

    this.teams = [
      new BattleTeam(1, "유비군", "green", true),
      new BattleTeam(2, "조조군", "red", false),
    ];

    this.units = [
      new BattleUnit(
        1,
        this.teams[0],
        10,
        10,
        "TOP",
        1000,
        1,
        2,
        3,
        3,
        "NORMAL"
      ),
      new BattleUnit(
        2,
        this.teams[1],
        10,
        5,
        "BOTTOM",
        1000,
        1,
        2,
        3,
        3,
        "NORMAL"
      ),
      new BattleUnit(
        3,
        this.teams[1],
        12,
        5,
        "BOTTOM",
        1000,
        1,
        2,
        3,
        3,
        "NORMAL"
      ),
    ];

    this.ai = new BattleAi(this, this.teams[1], this.teams[0]);

    this.state = "NORMAL";
    this.turn = 1;
    this.turnTeam = this.teams[0];

    this.map.battleGame = this;
    this.map.tiles.forEach((tile) => (tile.battleGame = this));
    this.teams.forEach((team) => (team.battleGame = this));
    this.units.forEach((unit) => (unit.battleGame = this));
  }

  get playerTeam() {
    return this.teams.find((team) => team.isPlayerTeam);
  }

  getUnits(team) {
    return this.units.filter((unit) => unit.team.id == team.id);
  }

  passTurn() {
    const currentTeamIndex = this.teams.findIndex(
      (team) => team.id == this.turnTeam.id
    );
    const lastTeamIndex = this.teams.length - 1;
    if (currentTeamIndex == lastTeamIndex) {
      this.turn += 1;
      this.turnStartAction();

      this.turnTeam = this.teams[0];
    } else {
      this.turnTeam = this.teams[currentTeamIndex + 1];
      if (!this.turnTeam.isPlayerTeam) {
        this.ai.play();
      }
    }
  }

  turnStartAction() {
    this.units.forEach((unit) => unit.turnStartAction());
  }

  toNormalState() {
    this.state = "NORMAL";
    this.selectedUnit = null;
    this.map.tiles.forEach((tile) => (tile.state = "NORMAL"));
  }

  checkVictory() {
    const defeatTeam = this.teams.find((team) => team.units.length <= 0);
    if (defeatTeam) {
      console.log("defeatTeam", defeatTeam.name);
    }
  }
}
