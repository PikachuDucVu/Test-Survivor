import { Archetype, World } from "flat-ecs";
import {
  AssetManager,
  BitmapFont,
  InputHandler,
  OrthoCamera,
  PolygonBatch,
  Screen,
  ShapeRenderer,
  Vector2,
  Viewport,
  ViewportInputHandler,
} from "gdxts";

import { Health } from "../component/Health";
import { Moveable } from "../component/Movable";
import { Spartial } from "../component/Spatial";
import { Constants } from "../Constant";
import { ConfigGame } from "../dto/ConfigGame";
import { GameState } from "../dto/GameState";
import { JoyStick } from "../dto/JoyStick";
import { LevelState } from "../dto/LevelState";
import { GridMapRenderSystem } from "../System/player/GridMapRenderSystem";
import { PowerEnemy } from "../dto/PowerEnemy";
import { PauseMovementSystem } from "../System/PauseMovementSystem";
import { CameraProcessingSystem } from "../System/CameraProcessingSystem";
import { EnemyMovementSystem } from "../System/EnemyMovementSystem";
import { EnemyRenderSystem } from "../System/EnemyRenderSystem";
import { EnemySpawningSystem } from "../System/EnemySpawningSystem";
import { JoystickRenderSystem } from "../System/player/JoystickRenderSystem";
import { JoystickSystem } from "../System/player/JoystickSystem";
import { ProtectBallProcessSystem } from "../System/player/ProtectBallProcessSystem";
import { ProtectBallRenderSystem } from "../System/player/ProtectBallRenderSystem";
import { ProtectBallSpawningSystem } from "../System/player/ProtectBallSpawningSystem";
import { BulletProcessSystem } from "../System/player/BulletProcessSystem";
import { BulletRenderSystem } from "../System/player/BulletRenderSystem";
import { BulletSpawningSystem } from "../System/player/BulletSpawningSystem";
import { PlayerMovementSystem } from "../System/PlayerMovementSystem";
import { PlayerRenderSystem } from "../System/PlayerRenderSystem";
import { UpgradeLevelSystem } from "../System/UpgradeLevelSystem";
import { UIRenderSystem } from "../System/UIRenderSystem";
import { SuperBulletProcessSystem } from "../System/player/SuperBulletProcessSystem";
import { SuperBulletSpawningSystem } from "../System/player/SuperBulletSpawningSystem";
import { SuperBulletRenderSystem } from "../System/player/SuperBulletRenderSystem";

export const createGameScreen = async (
  assetManager: AssetManager,
  viewport: Viewport
): Promise<Screen> => {
  const gl = viewport.getContext();
  const cameraUI = viewport.getCamera();

  const viewportInfo = viewport.getViewportInfo();
  const cameraGame = new OrthoCamera(
    Constants.SCREEN_WIDTH,
    Constants.SCREEN_HEIGHT,
    viewportInfo.worldWidth,
    viewportInfo.worldHeight
  );
  viewport.addCamera(cameraGame);
  const world = new World();

  const batch = new PolygonBatch(gl);
  const shapeRenderer = new ShapeRenderer(gl);
  const inputHandler = new ViewportInputHandler(viewport);

  const font = await BitmapFont.load(gl, "./font.fnt");
  const font2 = await BitmapFont.load(gl, "./font2.fnt");

  const joyStick: JoyStick = {
    origin: new Vector2(),
    direction: new Vector2(),
    thumbPos: new Vector2(),

    touched: false,
    move: false,
    dragging: false,
  };

  //perSecond
  const playerArchetype = new Archetype([Spartial, Moveable, Health]);
  const player = world.createEntityByArchetype(playerArchetype);
  const gameState: GameState = {
    playerID: player,
    enemyIDs: [],
    bulletIDs: [],
    protectBall: [],
    superBulletIDs: [],
  };
  const levelState: LevelState = {
    role: 0,
    exp: 1,
    maxExp: 10,
    currentLevel: 1,
  };
  const powerEnemy: PowerEnemy = {
    hp: 100,
    damage: 25,
  };

  const configGame: ConfigGame = {
    cooldownBullet: 0.5,
    enemysRespawnTime: 1.25,
    amountProtectBall: levelState.currentLevel - 1,
    speedProtectBall: 2.5,
    bigBallCooldown: 1.25,

    start: true,
    pause: false,
    stop: false,
  };

  const spartialPlayer = world.getComponent(gameState.playerID, Spartial);
  spartialPlayer.setPos(0, 0);
  spartialPlayer.setRadius(25);
  const moveAblePlayer = world.getComponent(gameState.playerID, Moveable);
  moveAblePlayer.speed = 4;
  const healthPlayer = world.getComponent(gameState.playerID, Health);
  healthPlayer.setHp(100);
  healthPlayer.setMaxHP(100);

  world.register("cameraGame", cameraGame);
  world.register("batch", batch);
  world.register("shapeRenderer", shapeRenderer);
  world.register("assetManager", assetManager);
  world.register("cameraUI", cameraUI);
  world.register("cameraGame", cameraGame);

  world.register("gameState", gameState);
  world.register("configGame", configGame);
  world.register("levelState", levelState);
  world.register("powerEnemy", powerEnemy);

  world.register("inputHandler", inputHandler);
  world.register("joyStick", joyStick);
  world.register("font", font);
  world.register("font2", font2);

  world.addSystem(new JoystickSystem(), true);
  world.addSystem(new PlayerMovementSystem(), true);
  world.addSystem(new EnemySpawningSystem(), true);
  world.addSystem(new EnemyMovementSystem(), true);
  world.addSystem(new BulletSpawningSystem(), true);
  world.addSystem(new BulletProcessSystem(), true);
  world.addSystem(new ProtectBallSpawningSystem(), true);
  world.addSystem(new ProtectBallProcessSystem(), true);
  world.addSystem(new UpgradeLevelSystem(), true);
  world.addSystem(new SuperBulletSpawningSystem(), true);
  world.addSystem(new SuperBulletProcessSystem(), true);

  world.addSystem(new GridMapRenderSystem(), false);
  world.addSystem(new PlayerRenderSystem(), false);
  world.addSystem(new CameraProcessingSystem(), false);
  world.addSystem(new JoystickRenderSystem(), false);
  world.addSystem(new EnemyRenderSystem(), false);
  world.addSystem(new BulletRenderSystem(), false);
  world.addSystem(new ProtectBallRenderSystem(), false);
  world.addSystem(new PauseMovementSystem(), false);
  world.addSystem(new UIRenderSystem(), false);
  world.addSystem(new SuperBulletRenderSystem(), false);

  gl.clearColor(0, 0, 0, 1);

  return {
    update(delta: number) {
      gl.clear(gl.COLOR_BUFFER_BIT);
      batch.setProjection(cameraGame.combined);
      shapeRenderer.setProjection(cameraGame.combined);

      world.setDelta(delta);
      if (!configGame.pause && !configGame.stop) {
        world.processActiveSystem();
      }
      world.processPassiveSystem();
    },
    dispose(): void {},
  };
};
