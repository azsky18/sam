import Util from "./Util.js";

export default class BattleUnit {
  battleGame;
  id;
  team;
  x;
  y;
  direction;
  amount;
  attack;
  defense;
  actionPoint;
  state;

  constructor(
    id,
    team,
    x,
    y,
    direction,
    amount,
    attack,
    defense,
    actionPoint,
    maxActionPoint,
    state
  ) {
    this.id = id;
    this.team = team;
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.amount = amount;
    this.attack = attack;
    this.defense = defense;
    this.actionPoint = actionPoint;
    this.maxActionPoint = maxActionPoint;
    this.state = state;
  }

  get color() {
    return this.team.color;
  }

  get tile() {
    return this.battleGame.map.getTile(this.x, this.y);
  }

  get aroundTiles() {
    const left = this.x - 1;
    const right = this.x + 1;
    const top = this.y - 1;
    const bottom = this.y + 1;

    return [
      this.battleGame.map.getTile(left, this.y),
      this.battleGame.map.getTile(right, this.y),
      this.battleGame.map.getTile(this.x, top),
      this.battleGame.map.getTile(this.x, bottom),
    ].filter((t) => !!t);
  }

  get animations() {
    return this.battleGame.animations;
  }


  get moveableTiles() {
    const myTile = this.battleGame.map.getTile(this.x, this.y);
    return this.battleGame.map
      .getTilesByDistance(myTile, this.actionPoint)
      .filter((tile) => !tile.isLocateUnit);
  }

  get attackableTiles() {
    const myTile = this.battleGame.map.getTile(this.x, this.y);
    if (this.direction == "TOP") {
      return [this.battleGame.map.getTile(this.x, this.y - 1)].filter(
        (tile) => tile.isLocateUnit && tile.locateUnit.team.id != this.team.id
      );
    } else if (this.direction == "BOTTOM") {
      return [this.battleGame.map.getTile(this.x, this.y + 1)].filter(
        (tile) => tile.isLocateUnit && tile.locateUnit.team.id != this.team.id
      );
    } else if (this.direction == "LEFT") {
      return [this.battleGame.map.getTile(this.x - 1, this.y)].filter(
        (tile) => tile.isLocateUnit && tile.locateUnit.team.id != this.team.id
      );
    } else if (this.direction == "RIGHT") {
      return [this.battleGame.map.getTile(this.x + 1, this.y)].filter(
        (tile) => tile.isLocateUnit && tile.locateUnit.team.id != this.team.id
      );
    } else {
      console.log("illegal direction", this.direction);
    }

    // 전면부만 공격 가능하게 수정하면서 주석 해놓음
    // return this.battleGame.map
    //   .getTilesByDistance(myTile, 1)
    //   .filter(
    //     (tile) => tile.isLocateUnit && tile.locateUnit.team.id != this.team.id
    //   );
  }

  select() {
    if (this.actionPoint <= 0) {
      console.log("활동력이 없음");
      return;
    }

    if (this.team.id == this.battleGame.playerTeam.id) {
      this.battleGame.state = "UNIT_SELECT";
      this.battleGame.selectedUnit = this;

      this.changeTileState("UNIT_SELECT");
    } else {
      this.battleGame.state = "ENEMY_UNIT_INFO";
      this.battleGame.selectedUnit = this;

      this.changeTileState("UNIT_SELECT");
    }
  }

  changeTileState(state) {
    if (state == "UNIT_SELECT") {
      this.battleGame.map.tiles.forEach((tile) => (tile.state = "DISABLE"));
      this.moveableTiles.forEach((tile) => (tile.state = "ENABLE_MOVE"));
      this.attackableTiles.forEach((tile) => (tile.state = "ENABLE_ATTACK"));
    }
  }

  moveTo(x, y) {
    const currentTile = this.tile;
    const targetTile = this.battleGame.map.getTile(x, y);
    const distance = currentTile.distance(targetTile);

    this.x = x;
    this.y = y;
    this.actionPoint -= distance;
  }

  async attackTo(defender) {
    const times = this.actionPoint;

    for (let i = 0; i < times; i++) {
      const position = this.getRealPosition();
      await this.animations.explosion(position.x, position.y - 25);

      const attackSuccesser = this.amount * 0.3;

      const defenderDead = Math.floor(
        attackSuccesser *
          ((0.5 + (this.attack - defender.defense + 5) * 0.5) * 0.1) *
          (Util.random(7, 9) * 0.1)
      );

      const attackerDead = Math.floor(defenderDead * (Util.random(3, 7) * 0.1));

      defenderDead < defender.amount
        ? (defender.amount -= defenderDead)
        : (defender.amount = 0);
      attackerDead < this.amount
        ? (this.amount -= attackerDead)
        : (this.amount = 0);
      this.actionPoint -= 1;
      console.log(
        this.team.name +
          "의 유닛이" +
          defender.team.name +
          "의 유닛을 공격 : " +
          attackerDead +
          "명이 죽고 " +
          defenderDead +
          "을 죽임"
      );

      if (defender.amount <= 0) {
        defender.destroy();
        break;
      }

      if (this.amount <= 0) {
        this.destroy();
        break;
      }
    }

    this.battleGame.toNormalState();

    this.battleGame.checkVictory();
  }

  turnStartAction() {
    this.actionPoint = this.maxActionPoint;
  }

  destroy() {
    const index = this.battleGame.units.findIndex((unit) => unit.id == this.id);
    this.battleGame.units.splice(index, 1);
    console.log(this.name + " 괴멸");
  }

  getRealPosition() {
    return this.tile.getRealPosition();
  }
}
