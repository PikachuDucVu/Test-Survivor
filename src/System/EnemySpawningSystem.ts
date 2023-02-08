import { System, Inject, Archetype } from "flat-ecs";
import { Health } from "../component/Health";
import { Spartial } from "../component/Spatial";
import { Constants } from "../Constant";
import { ConfigGame } from "../dto/ConfigGame";
import { GameState } from "../dto/GameState";
import { LevelState } from "../dto/LevelState";
import { PowerEnemy } from "../dto/PowerEnemy";

export class EnemySpawningSystem extends System {
  @Inject("gameState") gameState: GameState;
  @Inject("configGame") configGame: ConfigGame;
  @Inject("powerEnemy") powerEnemy: PowerEnemy;
  @Inject("levelState") levelState: LevelState;

  MAX_ENEMIES = 40;

  time = -6;

  getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  process(): void {
    const spartialPlayer = this.world.getComponent(
      this.gameState.playerID,
      Spartial
    );

    this.time += this.world.delta;
    if (
      this.time >= this.configGame.enemysRespawnTime &&
      this.gameState.enemyIDs.length < this.MAX_ENEMIES
    ) {
      const enemyArchetype = new Archetype([Spartial, Health]);
      const enemy = this.world.createEntityByArchetype(enemyArchetype);
      this.gameState.enemyIDs.push(enemy);
      const spartialEnemy = this.world.getComponent(
        this.gameState.enemyIDs[this.gameState.enemyIDs.length - 1],
        Spartial
      );
      spartialEnemy.setPos(
        this.getRandomInt(0, Constants.SCREEN_WIDTH / 2),
        this.getRandomInt(0, Constants.SCREEN_HEIGHT / 2)
      );
      spartialEnemy.setRadius(25);
      const heathEnemy = this.world.getComponent(
        this.gameState.enemyIDs[this.gameState.enemyIDs.length - 1],
        Health
      );
      heathEnemy.setHp(this.powerEnemy.hp);
      heathEnemy.setMaxHP(this.powerEnemy.hp);

      this.time = 0;
    }
  }
}
