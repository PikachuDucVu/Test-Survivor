import { Archetype, Inject, System } from "flat-ecs";
import { Damage } from "../component/Damage";
import { Health } from "../component/Health";
import { Spartial } from "../component/Spatial";
import { ConfigGame } from "../dto/ConfigGame";
import { GameState } from "../dto/GameState";
import { LevelState } from "../dto/LevelState";
import { PowerEnemy } from "../dto/PowerEnemy";

export class UpgradeLevelSystem extends System {
  @Inject("levelState") levelState: LevelState;
  @Inject("gameState") gameState: GameState;
  @Inject("configGame") configGame: ConfigGame;
  @Inject("powerEnemy") powerEnemy: PowerEnemy;

  protectBallArchetype = new Archetype([Spartial, Damage]);
  offsetProtectBall = 100;

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
      this.configGame.speedProtectBall++;

      if (this.configGame.cooldownBullet > 0.3) {
        this.configGame.cooldownBullet -= 0.075;
      }
      if (this.configGame.amountProtectBall <= 15) {
      }
      this.configGame.amountProtectBall++;
      for (let i = this.configGame.amountProtectBall - 1; i >= 0; i--) {
        this.world.deleteEntity(this.gameState.protectBall[i]);
        this.gameState.protectBall.splice(i, 1);
      }
      for (let i = 0; i < this.configGame.amountProtectBall; i++) {
        const protectBall = this.world.createEntityByArchetype(
          this.protectBallArchetype
        );
        this.gameState.protectBall.push(protectBall);
        const damageProtectBall = this.world.getComponent(protectBall, Damage);
        damageProtectBall.setDmg(7 + 3 * this.levelState.currentLevel);
        const spartialProtectBall = this.world.getComponent(
          protectBall,
          Spartial
        );
        spartialProtectBall.pos.set(
          this.offsetProtectBall,
          this.offsetProtectBall
        );
        spartialProtectBall.setRadius(15);
        spartialProtectBall.setRotation(
          (360 / this.configGame.amountProtectBall) * i
        );
      }
    }
  }
}
