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
    // 돌격 패턴
    for (const unit of this.battleGame.getUnits(this.myTeam)) {
      while (unit.actionPoint > 0) {
        if (this.enemyTeam.units.length <= 0) {
          // 승리 선언
          return;
        }

        const attackableUnits = unit.attackableTiles.map(
          (tile) => tile.locateUnit
        );

        if (attackableUnits.length > 0) {
          await unit.attackTo(attackableUnits[0]);
        } else {
          // 이걸 좀 바꿔보자
          const targetTile = this.enemyTeam.units
            .flatMap((unit) => unit.aroundTiles)
            .filter((tile) => !tile.isLocateUnit)
            .reduce((r, v) => (r.distance(unit) <= v.distance(unit) ? r : v));

          const i = unit.moveableTiles
            .map((t) => t.distance(targetTile))
            .reduce((r, v, i, a) => (v >= a[r] ? r : i), -1);

          const moveTile = unit.moveableTiles[i];

          await unit.move(moveTile.x, moveTile.y);

          unit.direction = unit.detectDirection(
            targetTile.aroundTiles.find((t) => t.isLocateUnit)
          );
        }
      }
    }

    this.battleGame.passTurn();
  }
}
