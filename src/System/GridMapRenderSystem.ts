import { System, Inject } from "flat-ecs";
import { Color, ShapeRenderer } from "gdxts";
import { Spartial } from "../component/Spatial";
import { Constants } from "../Constant";
import { GameState } from "../dto/GameState";

const GRID_WIDTH = Constants.SCREEN_WIDTH / 10;
const GRID_HEIGHT = GRID_WIDTH;

export class GridMapRenderSystem extends System {
  @Inject("shapeRenderer") shapeRenderer: ShapeRenderer;
  @Inject("gameState") gameState: GameState;

  process(): void {
    const spartialPlayer = this.world.getComponent(
      this.gameState.playerID,
      Spartial
    );

    this.shapeRenderer.begin();
    //GridX
    const deltaX = spartialPlayer.pos.x % (Constants.SCREEN_WIDTH / 2);
    const totalDrawX = Math.ceil(
      (Constants.SCREEN_WIDTH + Math.abs(deltaX)) / GRID_WIDTH
    );

    for (let i = 0; i <= totalDrawX; i++) {
      let x = 0;
      if (spartialPlayer.pos.x >= 0) {
        x =
          spartialPlayer.pos.x -
          deltaX +
          GRID_WIDTH * i -
          Constants.SCREEN_WIDTH / 2;
      } else {
        x =
          spartialPlayer.pos.x -
          deltaX -
          GRID_WIDTH * i +
          Constants.SCREEN_WIDTH / 2;
      }
      this.shapeRenderer.line(
        x,
        -Constants.SCREEN_HEIGHT / 2 + spartialPlayer.pos.y,
        x,
        Constants.SCREEN_HEIGHT + spartialPlayer.pos.y,
        Color.MAGENTA
      );
    }

    // GridY
    const deltaY = spartialPlayer.pos.y % (Constants.SCREEN_HEIGHT / 2);
    const totalDrawY = Math.ceil(
      (Constants.SCREEN_HEIGHT + Math.abs(deltaY)) / GRID_HEIGHT
    );
    for (let i = 0; i < totalDrawY; i++) {
      let y = 0;
      if (spartialPlayer.pos.y >= 0) {
        y =
          spartialPlayer.pos.y -
          deltaY +
          GRID_HEIGHT * i -
          Constants.SCREEN_HEIGHT / 2;
      } else {
        y =
          spartialPlayer.pos.y -
          deltaY -
          GRID_HEIGHT * i +
          Constants.SCREEN_HEIGHT / 2;
      }
      this.shapeRenderer.line(
        -Constants.SCREEN_WIDTH / 2 + spartialPlayer.pos.x,
        y,
        Constants.SCREEN_WIDTH + spartialPlayer.pos.x,
        y,
        Color.MAGENTA
      );
    }
    this.shapeRenderer.end();
  }
}
