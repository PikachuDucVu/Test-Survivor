import { Inject, System } from "flat-ecs";
import { AssetManager, Color, ShapeRenderer } from "gdxts";
import { Health } from "../component/Health";
import { Spartial } from "../component/Spatial";
import { GameState } from "../dto/GameState";

export class EnemyRenderSystem extends System {
  @Inject("assetManager") assetManager: AssetManager;
  @Inject("shapeRenderer") shapeRenderer: ShapeRenderer;
  @Inject("gameState") gameState: GameState;

  width = 50;
  offset = 25;

  process(): void {
    this.shapeRenderer.begin();
    for (let i = 0; i < this.gameState.enemyIDs.length; i++) {
      const spartial = this.world.getComponent(
        this.gameState.enemyIDs[i],
        Spartial
      );
      const healthEnemy = this.world.getComponent(
        this.gameState.enemyIDs[i],
        Health
      );
      this.shapeRenderer.circle(
        true,
        spartial.pos.x,
        spartial.pos.y,
        spartial.radius,
        Color.BLUE
      );
      this.shapeRenderer.rect(
        true,
        spartial.pos.x - this.offset,
        spartial.pos.y - this.offset - 15,
        this.width * (healthEnemy.hp / healthEnemy.maxHP),
        15,
        healthEnemy.hp >= 45 ? Color.GREEN : Color.RED
      );
      this.shapeRenderer.rect(
        false,
        spartial.pos.x - this.offset,
        spartial.pos.y - this.offset - 15,
        this.width,
        15
      );
    }
    this.shapeRenderer.end();
  }
}
