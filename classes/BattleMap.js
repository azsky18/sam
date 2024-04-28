import BattleTile from "./BattleTile.js";

export default class BattleMap {
  battleGame;
  width;
  height;
  tiles1d;
  tiles2d;

  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.tiles2d = this.#createTiles(width, height);
    this.tiles1d = [].concat(...this.tiles2d);
  }

  #createTiles(width, height) {
    return [...Array(height)].map((e1, i) =>
      Array.apply(null, Array(width)).map((e2, j) => new BattleTile(j, i))
    );
  }

  get pagePosition() {
    if (!this.el) {
      return null;
    }

    const rect = this.el.getBoundingClientRect();

    return {
      x: rect.x,
      y: rect.y,
    };
  }

  get tiles() {
    return this.tiles1d;
  }

  getTile(x, y) {
    if (this.tiles2d[y]) {
      return this.tiles2d[y][x];
    }
  }

  getTilesByDistance(tile, distance) {
    return this.tiles1d.filter((t) => t.distance(tile) <= distance);
  }
}
