import { Archetype, Inject, System } from "flat-ecs";
import { Damage } from "../../component/Damage";
import { Spartial } from "../../component/Spatial";
import { ConfigGame } from "../../dto/ConfigGame";
import { GameState } from "../../dto/GameState";

export class ProtectBallSpawningSystem extends System {
  @Inject("gameState") gameState: GameState;
  @Inject("configGame") configGame: ConfigGame;

  offset = 100;
  initialized(): void {
    // for (let i = 0; i < this.configGame.amountProtectBall; i++) {
    // const protectBallArchetype = new Archetype([Spartial, Damage]);
    // const protectBall =
    //   this.world.createEntityByArchetype(protectBallArchetype);
    // this.gameState.protectBall.push(protectBall);
    // const damageProtectBall = this.world.getComponent(
    //   this.gameState.protectBall[i],
    //   Damage
    // );
    // damageProtectBall.setDmg(10);
    // const spartialProtectBall = this.world.getComponent(
    //   this.gameState.protectBall[i],
    //   Spartial
    // );
    // spartialProtectBall.pos.set(this.offset, this.offset);
    // spartialProtectBall.setRadius(15);
    // spartialProtectBall.setRotation(
    //   (360 / this.configGame.amountProtectBall) * i
    // );
    // }
  }

  process(): void {}
}
