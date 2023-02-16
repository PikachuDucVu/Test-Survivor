import { Inject, System } from "flat-ecs";
import { Damage } from "../../component/Damage";
import { Health } from "../../component/Health";
import { Moveable } from "../../component/Movable";
import { Spartial } from "../../component/Spatial";
import { ConfigGame } from "../../dto/ConfigGame";
import { CurrentSkillLevel } from "../../dto/CurrentSkillLevel";
import { GameState } from "../../dto/GameState";

export class FireBallProcessSystem extends System {
  @Inject("configGame") configGame: ConfigGame;
  @Inject("gameState") gameState: GameState;
  @Inject("currentSkillLevel") currentSkillLevel: CurrentSkillLevel;

  process(): void {
    for (let i = 0; i < this.gameState.fireBallIDs.length; i++) {
      const spartialFireBall = this.world.getComponent(
        this.gameState.fireBallIDs[i],
        Spartial
      );
      const moveAbleFireBall = this.world.getComponent(
        this.gameState.fireBallIDs[i],
        Moveable
      );
      const damageFireBall = this.world.getComponent(
        this.gameState.fireBallIDs[i],
        Damage
      );
      if (moveAbleFireBall.target.distance(spartialFireBall.pos) >= 5) {
        spartialFireBall.pos.add(
          moveAbleFireBall.direction.x * moveAbleFireBall.speed,
          moveAbleFireBall.direction.y * moveAbleFireBall.speed
        );
      } else {
        for (let i = 0; i < this.gameState.enemyIDs.length; i++) {
          const spartialEnemy = this.world.getComponent(
            this.gameState.enemyIDs[i],
            Spartial
          );
          const moveableEnemy = this.world.getComponent(
            this.gameState.enemyIDs[i],
            Moveable
          );
          const healthEnemy = this.world.getComponent(
            this.gameState.enemyIDs[i],
            Health
          );

          if (
            spartialFireBall.pos.distance(spartialEnemy.pos) <=
            spartialFireBall.radius
          ) {
            healthEnemy.hp = Math.max(
              healthEnemy.hp - damageFireBall.damage,
              0
            );
            moveableEnemy.setSpeed(1);
          } else {
          }
        }
      }
    }
  }
}
