export default class BattleTile {
  battleGame;
  x;
  y;
  state;

  el;

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.state = "NORMAL";
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

  distance(other) {
    return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
  }

  getRealPosition() {
    const rect = this.el.getBoundingClientRect();
    return {
      x: rect.x,
      y: rect.y,
    };
  }
}
