import { Vector2 } from "gdxts";

export interface JoyStick {
  origin: Vector2;
  thumbPos: Vector2;
  direction: Vector2;

  touched: boolean;
  move: boolean;
  dragging: boolean;
}
