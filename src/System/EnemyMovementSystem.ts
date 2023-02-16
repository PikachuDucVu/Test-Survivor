import { System, Inject } from "flat-ecs";
import { Vector2 } from "gdxts";
import { Health } from "../component/Health";
import { Moveable } from "../component/Movable";
import { Spartial } from "../component/Spatial";
import { GameState } from "../dto/GameState";
import { JoyStick } from "../dto/JoyStick";
import { LevelState } from "../dto/LevelState";

export class EnemyMovementSystem extends System {
  @Inject("gameState") gameState: GameState;
  @Inject("joyStick") joyStick: JoyStick;
  @Inject("levelState") levelState: LevelState;

  direction = new Vector2();

  process(): void {
    const spartialPlayer = this.world.getComponent(
      this.gameState.playerID,
      Spartial
    );
    for (let i = this.gameState.enemyIDs.length - 1; i >= 0; i--) {
      const healthEnemy = this.world.getComponent(
        this.gameState.enemyIDs[i],
        Health
      );
      if (healthEnemy.hp <= 0) {
        this.world.deleteEntity(this.gameState.enemyIDs[i]);
        this.gameState.enemyIDs.splice(i, 1);
        this.levelState.exp++;
      }
    }
    for (let i = 0; i < this.gameState.enemyIDs.length; i++) {
      const spartialEnemy = this.world.getComponent(
        this.gameState.enemyIDs[i],
        Spartial
      );
      const moveableEnemy = this.world.getComponent(
        this.gameState.enemyIDs[i],
        Moveable
      );

      this.direction
        .setVector(spartialPlayer.pos)
        .subVector(spartialEnemy.pos)
        .nor();

      spartialEnemy.pos.add(
        this.direction.x * moveableEnemy.speed,
        this.direction.y * moveableEnemy.speed
      );
    }
  }
}
