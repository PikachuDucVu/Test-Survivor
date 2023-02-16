import { Archetype, Inject, System } from "flat-ecs";
import { Health } from "../component/Health";
import { ConfigGame } from "../dto/ConfigGame";
import { CurrentSkillLevel } from "../dto/CurrentSkillLevel";
import { GameState } from "../dto/GameState";
import { LevelState } from "../dto/LevelState";
import { PowerEnemy } from "../dto/PowerEnemy";

export class UpgradeLevelSystem extends System {
  @Inject("levelState") levelState: LevelState;
  @Inject("gameState") gameState: GameState;
  @Inject("configGame") configGame: ConfigGame;
  @Inject("powerEnemy") powerEnemy: PowerEnemy;
  @Inject("currentSkillLevel") currentSkillLevel: CurrentSkillLevel;

  process(): void {
    const healthPlayer = this.world.getComponent(
      this.gameState.playerID,
      Health
    );

    if (this.levelState.exp >= this.levelState.maxExp) {
      healthPlayer.hp = healthPlayer.maxHP;
      this.levelState.exp = 1;
      this.levelState.currentLevel++;
      this.levelState.maxExp += 10;
      this.configGame.enemysRespawnTime /= 1.25;
      this.powerEnemy.hp += 75;
      this.currentSkillLevel.point += 1;

      //   for (let i = this.configGame.amountProtectBall - 1; i >= 0; i--) {
      //     this.world.deleteEntity(this.gameState.protectBall[i]);
      //     this.gameState.protectBall.splice(i, 1);
      //   }
      //   for (let i = 0; i < this.configGame.amountProtectBall; i++) {
      //     const protectBall = this.world.createEntityByArchetype(
      //       this.protectBallArchetype
      //     );
      //     this.gameState.protectBall.push(protectBall);
      //     const damageProtectBall = this.world.getComponent(protectBall, Damage);
      //     damageProtectBall.setDmg(7 + 3 * this.levelState.currentLevel);
      //     const spartialProtectBall = this.world.getComponent(
      //       protectBall,
      //       Spartial
      //     );
      //     spartialProtectBall.pos.set(
      //       this.offsetProtectBall,
      //       this.offsetProtectBall
      //     );
      //     spartialProtectBall.setRadius(15);
      //     spartialProtectBall.setRotation(
      //       (360 / this.configGame.amountProtectBall) * i
      //     );
      //   }
    }
  }
}
