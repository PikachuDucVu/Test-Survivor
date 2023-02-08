import { Inject, System } from "flat-ecs";
import {
  AssetManager,
  Color,
  OrthoCamera,
  PolygonBatch,
  ShapeRenderer,
  Texture,
  Vector2,
} from "gdxts";
import { Health } from "../component/Health";
import { Spartial } from "../component/Spatial";
import { GameState } from "../dto/GameState";
import { LevelState } from "../dto/LevelState";

export class PlayerRenderSystem extends System {
  @Inject("shapeRenderer") shapeRenderer: ShapeRenderer;
  @Inject("assetManager") assetManager: AssetManager;
  @Inject("batch") batch: PolygonBatch;
  @Inject("cameraGame") cameraGame: OrthoCamera;
  @Inject("cameraUI") cameraUI: OrthoCamera;
  @Inject("gameState") gameState: GameState;
  @Inject("levelState") levelState: LevelState;

  width = 50;
  offset = 30;
  tempDirection = new Vector2(0, 0);
  offsetAngle = 45;
  knight1: Texture;
  knight2: Texture;
  knight3: Texture;
  knight4: Texture;
  knight5: Texture;

  husband: Texture;

  initialized(): void {
    this.knight1 = this.assetManager.getTexture("knight1") as Texture;
    this.knight2 = this.assetManager.getTexture("knight2") as Texture;
    this.knight3 = this.assetManager.getTexture("knight3") as Texture;
    this.knight4 = this.assetManager.getTexture("knight4") as Texture;

    this.husband = this.assetManager.getTexture("husband") as Texture;
  }

  process(): void {
    const spartial = this.world.getComponent(this.gameState.playerID, Spartial);
    const healthPlayer = this.world.getComponent(
      this.gameState.playerID,
      Health
    );
    this.shapeRenderer.begin();

    if (healthPlayer.hp > 0) {
      // this.shapeRenderer.circle(
      //   true,
      //   spartial.pos.x,
      //   spartial.pos.y,
      //   spartial.radius,
      //   Color.GREEN
      // );

      this.shapeRenderer.rect(
        true,
        spartial.pos.x - this.offset,
        spartial.pos.y - this.offset - 15,
        this.width * (healthPlayer.hp / healthPlayer.maxHP),
        15,
        Color.RED
      );
      this.shapeRenderer.rect(
        false,
        spartial.pos.x - this.offset,
        spartial.pos.y - this.offset - 15,
        this.width,
        15
      );
      //exp
      this.shapeRenderer.rect(
        true,
        spartial.pos.x - this.offset - 1,
        spartial.pos.y - this.offset - 25,
        this.width * (this.levelState.exp / this.levelState.maxExp),
        10,
        Color.WHITE
      );
      this.tempDirection.set(50, 50);
      this.tempDirection.rotate(spartial.rotation - this.offsetAngle);
      this.tempDirection.addVector(spartial.pos);
      this.shapeRenderer.circle(
        true,
        this.tempDirection.x,
        this.tempDirection.y,
        10,
        Color.MAGENTA
      );
    }
    this.shapeRenderer.end();
    this.batch.setProjection(this.cameraGame.combined);
    this.batch.begin();
    if (healthPlayer.hp >= 0) {
      // if (this.levelState.currentLevel === 1) {
      //   this.batch.draw(
      //     this.knight4,
      //     spartial.pos.x - this.offset,
      //     spartial.pos.y - this.offset,
      //     65,
      //     65
      //   );
      // }
      // if (this.levelState.currentLevel === 2) {
      //   this.batch.draw(
      //     this.knight3,
      //     spartial.pos.x - this.offset,
      //     spartial.pos.y - this.offset,
      //     65,
      //     65
      //   );
      // }
      // if (this.levelState.currentLevel === 3) {
      //   this.batch.draw(
      //     this.knight2,
      //     spartial.pos.x - this.offset,
      //     spartial.pos.y - this.offset,
      //     65,
      //     65
      //   );
      // }
      // if (this.levelState.currentLevel >= 4) {
      //   this.batch.draw(
      //     this.knight1,
      //     spartial.pos.x - this.offset,
      //     spartial.pos.y - this.offset,
      //     65,
      //     65
      //   );
      // }
      if (this.levelState.currentLevel >= 1) {
        this.batch.draw(
          this.husband,
          spartial.pos.x - this.offset,
          spartial.pos.y - this.offset,
          55,
          70
        );
      }
    }
    this.batch.end();
    this.batch.setProjection(this.cameraUI.combined);
  }
}
