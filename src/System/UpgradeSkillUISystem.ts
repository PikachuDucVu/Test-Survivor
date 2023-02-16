import { Inject, System } from "flat-ecs";
import {
  AssetManager,
  BitmapFont,
  OrthoCamera,
  PolygonBatch,
  Texture,
} from "gdxts";
import { CurrentSkillLevel } from "../dto/CurrentSkillLevel";
import { JoyStick } from "../dto/JoyStick";

export class UpgradeSkillUISystem extends System {
  @Inject("cameraUI") cameraUI: OrthoCamera;
  @Inject("cameraGame") cameraGame: OrthoCamera;
  @Inject("batch") batch: PolygonBatch;
  @Inject("currentSkillLevel") currentSkillLevel: CurrentSkillLevel;
  @Inject("assetManager") assetManager: AssetManager;
  @Inject("joyStick") joyStick: JoyStick;
  @Inject("font") font: BitmapFont;
  @Inject("font2") font2: BitmapFont;

  arrowUp: Texture;
  arrowDown: Texture;
  offset = 175;

  initialized(): void {
    this.arrowUp = this.assetManager.getTexture("arrowUp") as Texture;
    this.arrowDown = this.assetManager.getTexture("arrowDown") as Texture;
  }

  process(): void {
    this.batch.begin();

    if (this.joyStick.dragging === false) {
      this.font2.draw(
        this.batch,
        "Point: " + this.currentSkillLevel.point,
        25,
        325,
        1000
      );

      //1
      this.batch.draw(this.arrowUp, 75, 175, 75, 75);
      this.batch.draw(this.arrowDown, 75, 75, 75, 75);
      this.font2.draw(
        this.batch,
        this.currentSkillLevel.skill1.toString(),
        105 + this.offset * 0,
        175,
        10
      );

      //2
      this.batch.draw(this.arrowUp, 75 + this.offset * 1, 175, 75, 75);
      this.batch.draw(this.arrowDown, 75 + this.offset * 1, 75, 75, 75);
      this.font2.draw(
        this.batch,
        this.currentSkillLevel.skill2.toString(),
        105 + this.offset * 1,
        175,
        10
      );

      //3
      this.batch.draw(this.arrowUp, 75 + this.offset * 2, 175, 75, 75);
      this.batch.draw(this.arrowDown, 75 + this.offset * 2, 75, 75, 75);
      this.font2.draw(
        this.batch,
        this.currentSkillLevel.skill3.toString(),
        105 + this.offset * 2,
        175,
        10
      );

      //4
      this.batch.draw(this.arrowUp, 75 + this.offset * 3, 175, 75, 75);
      this.batch.draw(this.arrowDown, 75 + this.offset * 3, 75, 75, 75);
      this.font2.draw(
        this.batch,
        this.currentSkillLevel.skill4.toString(),
        105 + this.offset * 3,
        175,
        10
      );
    }

    this.batch.end();
  }
}
