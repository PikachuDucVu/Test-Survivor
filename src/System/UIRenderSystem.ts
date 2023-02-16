import { Inject, System } from "flat-ecs";
import {
  AssetManager,
  BitmapFont,
  OrthoCamera,
  PolygonBatch,
  ShapeRenderer,
  Texture,
} from "gdxts";
import { Health } from "../component/Health";
import { Spartial } from "../component/Spatial";
import { Constants } from "../Constant";
import { ConfigGame } from "../dto/ConfigGame";
import { CurrentSkillLevel } from "../dto/CurrentSkillLevel";
import { GameState } from "../dto/GameState";
import { LevelState } from "../dto/LevelState";

export class UIRenderSystem extends System {
  @Inject("assetManager") assetManager: AssetManager;
  @Inject("shapeRenderer") shapeRenderer: ShapeRenderer;
  @Inject("batch") batch: PolygonBatch;
  @Inject("cameraUI") cameraUI: OrthoCamera;
  @Inject("cameraGame") cameraGame: OrthoCamera;
  @Inject("configGame") configGame: ConfigGame;
  @Inject("gameState") gameState: GameState;
  @Inject("levelState") levelState: LevelState;
  @Inject("font") font: BitmapFont;
  @Inject("font2") font2: BitmapFont;
  @Inject("currentSkillLevel") currentSkillLevel: CurrentSkillLevel;

  pauseIcon: Texture;
  playIcon: Texture;
  intro = 5;
  offset = 25;

  initialized(): void {
    this.pauseIcon = this.assetManager.getTexture("pauseIcon") as Texture;
    this.playIcon = this.assetManager.getTexture("playIcon") as Texture;
  }

  process(): void {
    const spartialPlayer = this.world.getComponent(
      this.gameState.playerID,
      Spartial
    );
    const healthPlayer = this.world.getComponent(
      this.gameState.playerID,
      Health
    );

    this.batch.setProjection(this.cameraUI.combined);
    this.batch.begin();

    //welcome text
    if (this.intro >= 0) {
      this.intro -= this.world.delta;
      this.font2.draw(
        this.batch,
        "Welcome" +
          "\n" +
          "The Minions will spawn in: " +
          Math.round(this.intro),
        Constants.SCREEN_WIDTH / 2 - this.offset - 200,
        Constants.SCREEN_HEIGHT / 2 - this.offset + 500,
        500
      );
    }

    if (healthPlayer.hp) {
      this.font.draw(
        this.batch,
        this.levelState.currentLevel.toString(),
        spartialPlayer.pos.x - this.offset / 2 + 6,
        spartialPlayer.pos.y + this.offset / 2,
        0.25
      );
      this.font2.draw(
        this.batch,
        "Exp: " +
          this.levelState.exp +
          "/" +
          Math.floor(this.levelState.maxExp) +
          "\n" +
          "Level: " +
          this.levelState.currentLevel,
        0,
        Constants.SCREEN_HEIGHT - this.offset - 10,
        500
      );
    }

    // pause/playIcon
    if (this.configGame.start) {
      if (this.configGame.pause === false) {
        this.batch.draw(this.pauseIcon, 600, 1350, 100, 100);
      } else {
        this.batch.draw(this.playIcon, 600, 1350, 100, 100);
      }
    }
    this.batch.end();
  }
}
