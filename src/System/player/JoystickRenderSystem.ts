import { System, Inject } from "flat-ecs";
import { Color, OrthoCamera, ShapeRenderer, Vector2 } from "gdxts";
import { Health } from "../../component/Health";
import { GameState } from "../../dto/GameState";
import { JoyStick } from "../../dto/JoyStick";

export class JoystickRenderSystem extends System {
  @Inject("shapeRenderer") shapeRenderer: ShapeRenderer;
  @Inject("cameraUI") cameraUI: OrthoCamera;
  @Inject("cameraGame") cameraGame: OrthoCamera;
  @Inject("gameState") gameState: GameState;

  @Inject("joyStick") joyStick: JoyStick;

  process(): void {
    //joystick
    const healthPlayer = this.world.getComponent(
      this.gameState.playerID,
      Health
    );

    this.shapeRenderer.setProjection(this.cameraUI.combined);
    this.shapeRenderer.begin();
    if (healthPlayer.hp >= 0) {
      this.shapeRenderer.circle(
        false,
        this.joyStick.origin.x,
        this.joyStick.origin.y,
        125,
        Color.WHITE
      );
      this.shapeRenderer.circle(
        true,
        this.joyStick.thumbPos.x,
        this.joyStick.thumbPos.y,
        35,
        Color.WHITE
      );
    }

    this.shapeRenderer.end();
    this.shapeRenderer.setProjection(this.cameraGame.combined);
  }
}
