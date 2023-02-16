import { System, Inject, Archetype } from "flat-ecs";
import { Vector2 } from "gdxts";
import { Health } from "../component/Health";
import { Moveable } from "../component/Movable";
import { Spartial } from "../component/Spatial";
import { Constants } from "../Constant";
import { ConfigGame } from "../dto/ConfigGame";
import { GameState } from "../dto/GameState";
import { LevelState } from "../dto/LevelState";
import { PowerEnemy } from "../dto/PowerEnemy";

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export class EnemySpawningSystem extends System {
  @Inject("gameState") gameState: GameState;
  @Inject("configGame") configGame: ConfigGame;
  @Inject("powerEnemy") powerEnemy: PowerEnemy;
  @Inject("levelState") levelState: LevelState;

  MAX_ENEMIES = 1;

  time = -6;

  posSpawnEnemy = new Vector2();

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
      const enemyArchetype = new Archetype([Spartial, Health, Moveable]);
      const enemy = this.world.createEntityByArchetype(enemyArchetype);
      this.gameState.enemyIDs.push(enemy);
      const spartialEnemy = this.world.getComponent(
        this.gameState.enemyIDs[this.gameState.enemyIDs.length - 1],
        Spartial
      );
      const moveableEnemy = this.world.getComponent(
        this.gameState.enemyIDs[this.gameState.enemyIDs.length - 1],
        Moveable
      );

      do {
        this.posSpawnEnemy.set(
          getRandomInt(
            spartialPlayer.pos.x - Constants.SCREEN_WIDTH - 200,
            spartialPlayer.pos.x + Constants.SCREEN_WIDTH + 400
          ),
          getRandomInt(
            spartialPlayer.pos.y - Constants.SCREEN_HEIGHT - 200,
            spartialPlayer.pos.y + Constants.SCREEN_HEIGHT + 200
          )
        );
      } while (
        Math.abs(spartialPlayer.pos.x - this.posSpawnEnemy.x) <= 300 &&
        Math.abs(spartialPlayer.pos.y - this.posSpawnEnemy.y) <= 300
      );

      spartialEnemy.pos.setVector(this.posSpawnEnemy);
      spartialEnemy.setRadius(25);
      moveableEnemy.speed = 3;
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
