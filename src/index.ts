import {
  AssetManager,
  createGameLoop,
  createStage,
  createViewport,
  Game,
} from "gdxts";
import { Constants } from "./Constant";
import { createGameScreen } from "./gameScreen/GameScreen";

export const init = async () => {
  const stage = createStage();
  const canvas = stage.getCanvas();
  const viewport = createViewport(
    canvas,
    Constants.SCREEN_WIDTH,
    Constants.SCREEN_HEIGHT
  );
  const gl = viewport.getContext();

  const assetManager = new AssetManager(gl);
  await assetManager.loadTexture("./pauseIcon.png", "pauseIcon");
  await assetManager.loadTexture("./playIcon.png", "playIcon");

  await assetManager.loadTexture("./knight1.png", "knight1");
  await assetManager.loadTexture("./knight2.png", "knight2");
  await assetManager.loadTexture("./knight3.png", "knight3");
  await assetManager.loadTexture("./knight4.png", "knight4");
  await assetManager.loadTexture("./arrowUp.png", "arrowUp");
  await assetManager.loadTexture("./arrowDown.png", "arrowDown");

  Game.shared.setScreen(await createGameScreen(assetManager, viewport));

  createGameLoop((delta: number) => {
    Game.shared.update(delta);
  });
};
init();
