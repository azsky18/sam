export default class BattleTile {
  battleGame;
  x;
  y;
  movePoint;
  state;

  el;

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.movePoint = 1;
    this.state = "NORMAL";
  }

  get map() {
    return this.battleGame.map;
  }

  get isLocateUnit() {
    return this.battleGame.units.some(
      (unit) => unit.x == this.x && unit.y == this.y
    );
  }

  get locateUnit() {
    return this.battleGame.units.find(
      (unit) => unit.x == this.x && unit.y == this.y
    );
  }

  get aroundTiles() {
    return [
      this.map.getTile(this.x - 1, this.y),
      this.map.getTile(this.x + 1, this.y),
      this.map.getTile(this.x, this.y - 1),
      this.map.getTile(this.x, this.y + 1),
    ].filter((t) => !!t);
  }

  get realPosition() {
    if (!this.el) {
      return null;
    }

    const rect = this.el.getBoundingClientRect();
    return {
      x: rect.x,
      y: rect.y,
    };
  }

  select() {
    if (this.battleGame.state == "ENEMY_UNIT_INFO") {
      this.battleGame.toNormalState();
      return;
    }

    if (this.battleGame.state == "NORMAL") {
      if (this.isLocateUnit) {
        this.locateUnit.select();
      }
    } else if (this.battleGame.state == "UNIT_SELECT") {
      if (this.state == "ENABLE_ATTACK") {
        const attacker = this.battleGame.selectedUnit;
        const defender = this.locateUnit;
        this.battleGame.toNormalState();
        attacker.attackTo(defender);
      } else if (this.state == "ENABLE_MOVE") {
        const selectedUnit = this.battleGame.selectedUnit;
        selectedUnit.move(this.x, this.y);
        this.battleGame.toNormalState();
      }
    }
  }

  distance(other) {
    return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
  }

  moveDistance(other) {}
}
