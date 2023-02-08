import { System, Inject } from "flat-ecs";
import { ShapeRenderer } from "gdxts";
import { Health } from "../../component/Health";
import { Spartial } from "../../component/Spatial";
import { GameState } from "../../dto/GameState";

export class ProtectBallRenderSystem extends System {
  @Inject("shapeRenderer") shapeRenderer: ShapeRenderer;
  @Inject("gameState") gameState: GameState;

  process(): void {
    const healthPlayer = this.world.getComponent(
      this.gameState.playerID,
      Health
    );
    this.shapeRenderer.begin();
    if (healthPlayer.hp > 0) {
      for (let i = 0; i < this.gameState.protectBall.length; i++) {
        const spartial = this.world.getComponent(
          this.gameState.protectBall[i],
          Spartial
        );
        this.shapeRenderer.circle(
          true,
          spartial.pos.x,
          spartial.pos.y,
          spartial.radius
        );
      }
    }
    this.shapeRenderer.end();
  }
}
