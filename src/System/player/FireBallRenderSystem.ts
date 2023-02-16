import { Inject, System } from "flat-ecs";
import { Color, ShapeRenderer } from "gdxts";
import { Spartial } from "../../component/Spatial";
import { GameState } from "../../dto/GameState";

export class FireBallRenderSystem extends System {
  @Inject("shapeRenderer") shapeRenderer: ShapeRenderer;
  @Inject("gameState") gameState: GameState;

  process(): void {
    this.shapeRenderer.begin();
    for (let i = 0; i < this.gameState.fireBallIDs.length; i++) {
      const spartialFireBall = this.world.getComponent(
        this.gameState.fireBallIDs[i],
        Spartial
      );
      this.shapeRenderer.circle(
        true,
        spartialFireBall.pos.x,
        spartialFireBall.pos.y,
        spartialFireBall.radius,
        Color.RED
      );
    }
    this.shapeRenderer.end();
  }
}
