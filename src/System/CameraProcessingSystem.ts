import { System, Inject } from "flat-ecs";
import { OrthoCamera } from "gdxts";
import { Spartial } from "../component/Spatial";
import { GameState } from "../dto/GameState";

export class CameraProcessingSystem extends System {
  @Inject("cameraGame") cameraGame: OrthoCamera;
  @Inject("gameState") gameState: GameState;

  // initialized(): void {
  //   this.cameraGame.setPosition(
  //     Constants.SCREEN_WIDTH / 2,
  //     Constants.SCREEN_HEIGHT / 2
  //   );

  //   this.cameraGame.update();
  // }
  process(): void {
    const spartial = this.world.getComponent(this.gameState.playerID, Spartial);

    this.cameraGame.setPosition(spartial.pos.x, spartial.pos.y);

    this.cameraGame.update();
  }
}
