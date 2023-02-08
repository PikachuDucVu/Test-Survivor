import { System, Inject } from "flat-ecs";
import { Color, ShapeRenderer } from "gdxts";
import { Spartial } from "../../component/Spatial";
import { ConfigGame } from "../../dto/ConfigGame";
import { GameState } from "../../dto/GameState";

export class SuperBulletRenderSystem extends System {
  @Inject("shapeRenderer") shapeRenderer: ShapeRenderer;
  @Inject("gameState") gameState: GameState;
  @Inject("configGame") configGame: ConfigGame;

  process(): void {
    this.shapeRenderer.begin();
    for (let i = 0; i < this.gameState.superBulletIDs.length; i++) {
      const spartialBullet = this.world.getComponent(
        this.gameState.superBulletIDs[i],
        Spartial
      );
      this.shapeRenderer.circle(
        true,
        spartialBullet.pos.x,
        spartialBullet.pos.y,
        spartialBullet.radius,
        Color.GREEN
      );
    }

    this.shapeRenderer.end();
  }
}
