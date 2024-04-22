export default class BattleAi {
  battleGame;
  myTeam;
  enemyTeam;

  constructor(battleGame, myTeam, enemyTeam) {
    this.battleGame = battleGame;
    this.myTeam = myTeam;
    this.enemyTeam = enemyTeam;
  }

  async play() {
    for (const unit of this.battleGame.getUnits(this.myTeam)) {
      while (unit.actionPoint > 0) {
        if (this.enemyTeam.units.length <= 0) {
          return;
        }

        const attackableUnits = unit
          .attackableTiles
          .map((tile) => tile.locateUnit);

        if (attackableUnits.length > 0) {
          await unit.attackTo(attackableUnits[0]);
        } else {
          const targetTiles = this.enemyTeam.units.flatMap(
            (unit) => unit.aroundTiles
          );
          const minValueTargetTileIndex = targetTiles
            .map((t) => t.distance(unit))
            .reduce((r, v, i, a) => (v >= a[r] ? r : i), -1);
          const targetTile = targetTiles[minValueTargetTileIndex];

          const moveableTiles = unit.moveableTiles;
          const minValueMoveableTileIndex = moveableTiles
            .map((t) => t.distance(targetTile))
            .reduce((r, v, i, a) => (v >= a[r] ? r : i), -1);
          const moveTile = moveableTiles[minValueMoveableTileIndex];

          unit.moveTo(moveTile.x, moveTile.y);
        }
      }
    }

    this.battleGame.passTurn();
  }
}
