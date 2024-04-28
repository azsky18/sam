export default class BattleTile {
  battleGame;
  x;
  y;
  size;
  originMovePoint;
  state;
  props;

  el;

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 50;
    this.originMovePoint = 1;
    this.state = "NORMAL";
    this.props = [];
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
    return {
      x: this.x * this.size,
      y: this.y * this.size,
    };
  }

  get isZoc() {
    return this.zocUnits.length > 0;
  }

  get zocUnits() {
    return this.battleGame.units.filter(
      (unit) => unit.zocTile?.x == this.x && unit.zocTile?.y == this.y
    );
  }

  get movePoint() {
    // 테스트용 모브 포인트 99
    if (this.x == 9 && this.y == 9) {
      return 99;
    }

    if (this.isLocateUnit) {
      return 99;
    } else {
      return this.originMovePoint;
    }
  }

  async select() {
    if (this.battleGame.state == "ENEMY_UNIT_INFO") {
      this.battleGame.toNormalState();
      return;
    }

    if (this.battleGame.state == "UNIT_DIRECTION") {
      this.battleGame.toNormalState();
      return;
    }

    if (this.battleGame.state == "NORMAL") {
      if (!this.isLocateUnit) {
        return;
      }

      if (this.locateUnit.team.id != this.battleGame.playerTeam.id) {
        this.battleGame.state = "ENEMY_UNIT_INFO";
        this.battleGame.selectedUnit = this.locateUnit;

        this.updateTileState();
        return;
      }

      if (this.locateUnit.actionPoint <= 0) {
        console.log("활동력이 없음");
        return;
      }

      this.battleGame.state = "UNIT_SELECT";
      this.battleGame.selectedUnit = this.locateUnit;
      this.updateTileState();
    } else if (
      ["UNIT_SELECT", "UNIT_DIRECTION", "UNIT_DIRECTION_OR_ATTAACK"].includes(
        this.battleGame.state
      )
    ) {
      if (this.state == "ENABLE_MOVE") {
        const selectedUnit = this.battleGame.selectedUnit;
        await selectedUnit.move(this.x, this.y);

        this.battleGame.toNormalState();

        if (
          selectedUnit.actionPoint > 0 &&
          selectedUnit.attackableTiles.length > 0
        ) {
          console.log("움직였지만 행동력이 남아있고 공격할 적이 있다");
          selectedUnit.attackableTiles.forEach(
            (tile) => (tile.state = "ENABLE_ATTACK")
          );
          this.battleGame.state = "UNIT_DIRECTION_OR_ATTAACK";
          this.battleGame.selectedUnit = selectedUnit;
          this.updateTileState();
        } else {
          this.battleGame.state = "UNIT_DIRECTION";
          this.battleGame.selectedUnit = selectedUnit;
        }
        return;
      } else if (this.state == "ENABLE_ATTACK") {
        const attacker = this.battleGame.selectedUnit;
        const defender = this.locateUnit;

        this.battleGame.toNormalState();
        attacker.attackTo(defender);
        return;
      }
    }
  }

  handleHover() {
    if (this.battleGame.state == "UNIT_DIRECTION") {
      const hoverTile = this.battleGame.hoverTile;
      const selectedUnit = this.battleGame.selectedUnit;

      selectedUnit.direction = selectedUnit.detectDirection(hoverTile);
    }
  }

  updateTileState() {
    if (this.battleGame.state == "UNIT_SELECT") {
      this.battleGame.map.tiles.forEach((tile) => (tile.state = "DISABLE"));
      this.battleGame.selectedUnit.moveableTiles.forEach(
        (tile) => (tile.state = "ENABLE_MOVE")
      );
      this.battleGame.selectedUnit.attackableTiles.forEach(
        (tile) => (tile.state = "ENABLE_ATTACK")
      );
    }
  }

  distance(other) {
    return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
  }
}
