import { System, Inject } from "flat-ecs";
import { Color, ShapeRenderer } from "gdxts";
import { Spartial } from "../../component/Spatial";
import { ConfigGame } from "../../dto/ConfigGame";
import { GameState } from "../../dto/GameState";

export class BulletRenderSystem extends System {
  @Inject("shapeRenderer") shapeRenderer: ShapeRenderer;
  @Inject("gameState") gameState: GameState;
  @Inject("configGame") configGame: ConfigGame;

  process(): void {
    this.shapeRenderer.begin();
    for (let i = 0; i < this.gameState.bulletIDs.length; i++) {
      const spartialBullet = this.world.getComponent(
        this.gameState.bulletIDs[i],
        Spartial
      );
      this.shapeRenderer.circle(
        true,
        spartialBullet.pos.x,
        spartialBullet.pos.y,
        spartialBullet.radius,
        Color.RED
      );
    }

    this.shapeRenderer.end();
  }
}
