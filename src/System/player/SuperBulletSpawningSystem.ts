import { Archetype, Inject, System } from "flat-ecs";
import { Vector2 } from "gdxts";
import { Damage } from "../../component/Damage";
import { Moveable } from "../../component/Movable";
import { Spartial } from "../../component/Spatial";
import { ConfigGame } from "../../dto/ConfigGame";
import { GameState } from "../../dto/GameState";
import { JoyStick } from "../../dto/JoyStick";
import { LevelState } from "../../dto/LevelState";

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export class SuperBulletSpawningSystem extends System {
  @Inject("configGame") configGame: ConfigGame;
  @Inject("joyStick") joyStick: JoyStick;
  @Inject("gameState") gameState: GameState;
  @Inject("levelState") levelState: LevelState;

  timesuperBullet = 0;
  tempNumber = 0;
  tempVec2 = new Vector2();

  process(): void {
    this.timesuperBullet += this.world.delta;

    const spartialPlayer = this.world.getComponent(
      this.gameState.playerID,
      Spartial
    );

    //superBullet
    if (
      this.timesuperBullet >= this.configGame.bigBallCooldown &&
      this.gameState.enemyIDs.length &&
      this.levelState.currentLevel >= 10
    ) {
      const superBulletArchetype = new Archetype([Spartial, Moveable, Damage]);
      const superBullet =
        this.world.createEntityByArchetype(superBulletArchetype);
      this.gameState.superBulletIDs.push(superBullet);
      const spartialsuperBullet = this.world.getComponent(
        this.gameState.superBulletIDs[this.gameState.superBulletIDs.length - 1],
        Spartial
      );
      const moveAblesuperBullet = this.world.getComponent(
        this.gameState.superBulletIDs[this.gameState.superBulletIDs.length - 1],
        Moveable
      );
      const damagesuperBullet = this.world.getComponent(
        this.gameState.superBulletIDs[this.gameState.superBulletIDs.length - 1],
        Damage
      );

      damagesuperBullet.setDmg((15 * this.levelState.currentLevel) / 7);

      const spartialEnemy = this.world.getComponent(
        this.gameState.enemyIDs[
          getRandomInt(0, this.gameState.enemyIDs.length)
        ],
        Spartial
      );
      this.tempVec2
        .setVector(spartialEnemy.pos)
        .subVector(spartialPlayer.pos)
        .nor();

      moveAblesuperBullet.setDirection(this.tempVec2.x, this.tempVec2.y);
      moveAblesuperBullet.speed = 15;

      spartialsuperBullet.setPos(spartialPlayer.pos.x, spartialPlayer.pos.y);
      spartialsuperBullet.setRadius(
        10 + (10 * this.levelState.currentLevel) / 5
      );

      this.timesuperBullet = 0;
    }
  }
}
