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
  range;
  actionPoint;
  state;

  el;

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
    this.range = 1;
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

  get realPosition() {
    return this.tile.realPosition;
  }

  get aroundTiles() {
    return [
      this.battleGame.map.getTile(this.x - 1, this.y),
      this.battleGame.map.getTile(this.x + 1, this.y),
      this.battleGame.map.getTile(this.x, this.y - 1),
      this.battleGame.map.getTile(this.x, this.y + 1),
    ].filter((t) => !!t);
  }

  get animations() {
    return this.battleGame.animations;
  }

  get sounds() {
    return this.battleGame.sounds;
  }

  get moveableTiles() {
    const moveableTiles = [];

    const candidates = this.battleGame.map.getTilesByDistance(
      this.tile,
      this.actionPoint
    );

    for (const candidate of candidates) {
      for (const path of this.findPath(
        this.tile,
        candidate,
        this.actionPoint
      )) {
        //p
        //console.log("p", candidate, path);
        for (const tile of path) {
          if (!moveableTiles.find((t) => t.x == tile.x && t.y == tile.y)) {
            moveableTiles.push(tile);
          }
        }
      }
    }

    return moveableTiles;
  }

  get attackableTiles() {
    return this.battleGame.map
      .getTilesByDistance(this.tile, this.range)
      .filter(
        (tile) => tile.isLocateUnit && tile.locateUnit.team.id != this.team.id
      );
  }

  get zocTile() {
    if (this.direction == "TOP") {
      return this.battleGame.map.getTile(this.x, this.y - 1);
    } else if (this.direction == "RIGHT") {
      return this.battleGame.map.getTile(this.x + 1, this.y);
    } else if (this.direction == "BOTTOM") {
      return this.battleGame.map.getTile(this.x, this.y + 1);
    } else if (this.direction == "LEFT") {
      return this.battleGame.map.getTile(this.x - 1, this.y);
    }
  }

  async move(x, y) {
    if (this.x == x && this.y == y) {
      console.log("제자리 이동");
      return;
    }

    const currentTile = this.tile;
    const targetTile = this.battleGame.map.getTile(x, y);

    const path = this.findPath(currentTile, targetTile, this.actionPoint)
      .sort(
        (a, b) =>
          a.reduce((a, c) => a.movePoint + c.movePoint) -
          b.reduce((a, c) => a.movePoint + c.movePoint)
      )
      .sort((a, b) => a.length - b.length)[0]
      .slice(1);

    for (let i = 0; i < path.length; i++) {
      const pathTile = path[i];
      await this.moveToTile(pathTile);
    }
  }

  moveToTile(tile) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.y > tile.y) {
          this.direction = "TOP";
        } else if (this.x < tile.x) {
          this.direction = "RIGHT";
        } else if (this.y < tile.y) {
          this.direction = "BOTTOM";
        } else if (this.x > tile.x) {
          this.direction = "LEFT";
        }

        this.actionPoint -= tile.movePoint;
        this.x = tile.x;
        this.y = tile.y;

        resolve();
      }, 100);
    });
  }

  findPath(currentTile, targetTile, actionPoint, p = []) {
    const paths = [];
    if (p.length == 0) {
      paths.push([currentTile]);

      if (currentTile.x == targetTile.x && currentTile.y == targetTile.y) {
        return paths;
      }
    } else {
      paths.push(...p);
    }

    const newPaths = [];

    for (const path of paths) {
      const newTiles = path[path.length - 1].aroundTiles.filter(
        (aTile) => !path.find((p) => p.x == aTile.x && p.y == aTile.y)
      );

      for (const newTile of newTiles) {
        if (newTile.movePoint > actionPoint) {
          newPaths.push([...path]);
        } else if (targetTile.x == newTile.x && targetTile.y == newTile.y) {
          newPaths.push([...path, newTile]);
        } else {
          newPaths.push(
            ...this.findPath(
              currentTile,
              targetTile,
              actionPoint - targetTile.movePoint,
              [[...path, newTile]] // 이게 왜 1차원 배열 임
            )
          );
        }
      }
    }

    if (p.length == 0) {
      return newPaths.filter((path) => {
        const last = path[path.length - 1];
        return last.x == targetTile.x && last.y == targetTile.y;
      });
    } else {
      return newPaths;
    }
  }

  attackDirection(other) {
    const offset = ["TOP", "RIGHT"].includes(other.direction) ? 1 : -1;
    const holdProp = ["TOP", "BOTTOM"].includes(other.direction) ? "x" : "y";
    const changeProp = ["TOP", "BOTTOM"].includes(other.direction) ? "y" : "x";

    if (
      this[holdProp] == other[holdProp] &&
      this[changeProp] == other[changeProp] - offset
    ) {
      return "FACE";
    } else if (
      this[holdProp] == other[holdProp] &&
      this[changeProp] == other[changeProp] + offset
    ) {
      return "BACK";
    } else if (
      this[changeProp] == other[changeProp] &&
      (this[holdProp] == other[holdProp] + 1 || this.x == other[holdProp] - 1)
    ) {
      return "SIDE";
    }
  }

  async attackTo(defender) {
    this.direction = this.detectDirection(defender);
    const attackDirection = this.attackDirection(defender);

    const times = this.actionPoint;

    for (let i = 0; i < times; i++) {
      const position = this.realPosition;
      this.sounds.slash();

      const x =
        this.direction == "LEFT"
          ? position.x - this.tile.size / 2
          : this.direction == "RIGHT"
          ? position.x + this.tile.size / 2
          : position.x;

      const y =
        this.direction == "TOP"
          ? position.y - this.tile.size / 2
          : this.direction == "BOTTOM"
          ? position.y + this.tile.size / 2
          : position.y;

      await this.animations.explosion(x, y);

      const attackSuccesser = this.amount * 0.3;

      let defenderDead = Math.floor(
        attackSuccesser *
          ((0.5 + (this.attack - defender.defense + 5) * 0.5) * 0.1) *
          (Util.random(7, 9) * 0.1)
      );

      if (attackDirection == "SIDE") {
        defenderDead = Math.round(defenderDead * 1.25);
      } else if (attackDirection == "BACK") {
        defenderDead = Math.round(defenderDead * 1.5);
      }

      const attackerDead = Math.floor(defenderDead * (Util.random(3, 7) * 0.1));

      defenderDead < defender.amount
        ? (defender.amount -= defenderDead)
        : (defender.amount = 0);
      attackerDead < this.amount
        ? (this.amount -= attackerDead)
        : (this.amount = 0);
      this.actionPoint -= 1;

      if (attackDirection == "SIDE") {
        console.log(this.team.name, "유닛의 측면 공격 25% 추가 데미지");
      } else if (attackDirection == "BACK") {
        console.log(this.team.name, "유닛의 후면 공격 50% 추가 데미지");
      }

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

  detectDirection(other) {
    const hDistance = this.x - other.x;
    const vDistance = this.y - other.y;
    const hvDistance = Math.abs(hDistance) - Math.abs(vDistance);

    if (hvDistance <= 0 && vDistance > 0) {
      return "TOP";
    } else if (hvDistance > 0 && hDistance < 0) {
      return "RIGHT";
    } else if (hvDistance <= 0 && vDistance < 0) {
      return "BOTTOM";
    } else if (hvDistance > 0 && hDistance > 0) {
      return "LEFT";
    }
  }

  turnStartAction() {
    this.actionPoint = this.maxActionPoint;
  }

  destroy() {
    const index = this.battleGame.units.findIndex((unit) => unit.id == this.id);
    this.battleGame.units.splice(index, 1);
    console.log(this.name + " 괴멸");
  }
}
