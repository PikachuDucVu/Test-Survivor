import { System, Inject } from "flat-ecs";
import { Vector2 } from "gdxts";
import { Damage } from "../../component/Damage";
import { Health } from "../../component/Health";
import { Spartial } from "../../component/Spatial";
import { ConfigGame } from "../../dto/ConfigGame";
import { CurrentSkillLevel } from "../../dto/CurrentSkillLevel";
import { GameState } from "../../dto/GameState";

export class ProtectBallProcessSystem extends System {
  @Inject("gameState") gameState: GameState;
  @Inject("configGame") configGame: ConfigGame;
  @Inject("currentSkillLevel") currentSkillLevel: CurrentSkillLevel;
  offset = 100;
  defaultrotating = 1.5;
  tempVec2 = new Vector2();

  process(): void {
    for (let i = 0; i < this.gameState.protectBall.length; i++) {
      const spartialProtectBall = this.world.getComponent(
        this.gameState.protectBall[i],
        Spartial
      );
      const damageProtectBall = this.world.getComponent(
        this.gameState.protectBall[i],
        Damage
      );
      const spartialPlayer = this.world.getComponent(
        this.gameState.playerID,
        Spartial
      );
      spartialProtectBall.pos.set(this.offset, this.offset);
      spartialProtectBall.pos.rotate(
        (spartialProtectBall.rotation -=
          this.defaultrotating + this.currentSkillLevel.skill2)
      );
      spartialProtectBall.pos.addVector(spartialPlayer.pos);

      for (let j = this.gameState.enemyIDs.length - 1; j >= 0; j--) {
        const spartialEnemy = this.world.getComponent(
          this.gameState.enemyIDs[j],
          Spartial
        );
        const healthEnemy = this.world.getComponent(
          this.gameState.enemyIDs[j],
          Health
        );
        if (
          spartialEnemy.pos.x <= spartialProtectBall.pos.x + 35 &&
          spartialEnemy.pos.x >= spartialProtectBall.pos.x - 35 &&
          spartialEnemy.pos.y <= spartialProtectBall.pos.y + 35 &&
          spartialEnemy.pos.y >= spartialProtectBall.pos.y - 35
        ) {
          healthEnemy.hp = Math.max(
            healthEnemy.hp - damageProtectBall.damage,
            0
          );
          this.tempVec2
            .setVector(spartialEnemy.pos)
            .subVector(spartialPlayer.pos)
            .nor();
          spartialEnemy.pos.addVector(this.tempVec2.scale(5));
        }
      }
    }
  }
}
