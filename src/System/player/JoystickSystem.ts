import { Inject, System } from "flat-ecs";
import { Vector2, ViewportInputHandler } from "gdxts";
import { Constants } from "../../Constant";
import { JoyStick } from "../../dto/JoyStick";

export class JoystickSystem extends System {
  @Inject("inputHandler") inputHandler: ViewportInputHandler;
  @Inject("joyStick") joyStick: JoyStick;

  tempTouchedWorldCoord = new Vector2();
  tempDirection = new Vector2(
    Constants.DEFAULT_DIRECTION_X,
    Constants.DEFAULT_DIRECTION_Y
  );

  initialized(): void {}
  process(): void {
    //moveMainChar
    if (
      this.inputHandler.isTouched() &&
      this.inputHandler.getTouchedWorldCoord().y < Constants.SCREEN_HEIGHT / 2
    ) {
      if (this.joyStick.touched === false) {
        this.joyStick.origin.setVector(
          this.inputHandler.getTouchedWorldCoord()
        );
      }
      this.joyStick.touched = true;
      this.joyStick.move = true;

      if (!this.joyStick.dragging) {
        this.joyStick.dragging = true;
      }

      this.joyStick.direction
        .setVector(this.inputHandler.getTouchedWorldCoord())
        .subVector(this.joyStick.origin)
        .nor();

      if (
        this.joyStick.direction.x < 0 &&
        this.tempTouchedWorldCoord.x - this.joyStick.origin.x >
          this.joyStick.direction.x * 125
      ) {
        this.joyStick.thumbPos.setVector(
          this.inputHandler.getTouchedWorldCoord()
        );
      } else if (
        this.joyStick.direction.x > 0 &&
        this.tempTouchedWorldCoord.x - this.joyStick.origin.x <
          this.joyStick.direction.x * 125
      ) {
        this.joyStick.thumbPos.setVector(
          this.inputHandler.getTouchedWorldCoord()
        );
      } else {
        this.joyStick.thumbPos
          .setVector(this.joyStick.direction)
          .scale(125)
          .addVector(this.joyStick.origin);
      }

      this.tempTouchedWorldCoord.setVector(
        this.inputHandler.getTouchedWorldCoord()
      );
    } else {
      this.tempDirection.setVector(this.joyStick.direction);
      this.joyStick.touched = false;
      this.joyStick.dragging = false;
      this.joyStick.origin.set(375, 300);
      this.joyStick.thumbPos.set(375, 300);
    }
  }
}
