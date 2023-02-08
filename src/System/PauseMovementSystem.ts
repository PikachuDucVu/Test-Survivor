import { Inject, System } from "flat-ecs";
import { InputEvent, InputHandler, OrthoCamera, Vector2 } from "gdxts";
import { Health } from "../component/Health";
import { ConfigGame } from "../dto/ConfigGame";
import { GameState } from "../dto/GameState";

export class PauseMovementSystem extends System {
  @Inject("inputHandler") inputHandler: InputHandler;
  @Inject("cameraUI") cameraUI: OrthoCamera;
  @Inject("configGame") configGame: ConfigGame;
  @Inject("gameState") gameState: GameState;

  tempVec2 = new Vector2();

  initialized() {
    this.inputHandler.addEventListener(InputEvent.TouchStart, () => {
      //checkPause
      this.tempVec2 = this.inputHandler.getTouchedWorldCoord(this.cameraUI);
      const healthPlayer = this.world.getComponent(
        this.gameState.playerID,
        Health
      );

      if (
        this.tempVec2.x >= 600 &&
        this.tempVec2.x <= 700 &&
        this.tempVec2.y >= 1370 &&
        this.tempVec2.y <= 1450 &&
        healthPlayer.hp > 0
      ) {
        if (this.configGame.pause === false) {
          this.configGame.pause = true;
        } else {
          this.configGame.pause = false;
        }
      }
    });
  }

  process(): void {}
}
