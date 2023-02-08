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

export class BulletSpawningSystem extends System {
  @Inject("configGame") configGame: ConfigGame;
  @Inject("joyStick") joyStick: JoyStick;
  @Inject("gameState") gameState: GameState;
  @Inject("levelState") levelState: LevelState;

  time = 0;
  tempNumber = 0;
  tempVec2 = new Vector2();

  process(): void {
    this.time += this.world.delta;

    const spartialPlayer = this.world.getComponent(
      this.gameState.playerID,
      Spartial
    );

    //Skill3
    if (
      this.time >= this.configGame.cooldownBullet &&
      this.gameState.enemyIDs.length
    ) {
      const bulletArchetype = new Archetype([Spartial, Moveable, Damage]);
      const bullet = this.world.createEntityByArchetype(bulletArchetype);
      this.gameState.bulletIDs.push(bullet);
      const spartialBullet = this.world.getComponent(
        this.gameState.bulletIDs[this.gameState.bulletIDs.length - 1],
        Spartial
      );
      const moveAbleBullet = this.world.getComponent(
        this.gameState.bulletIDs[this.gameState.bulletIDs.length - 1],
        Moveable
      );
      const damageBullet = this.world.getComponent(
        this.gameState.bulletIDs[this.gameState.bulletIDs.length - 1],
        Damage
      );

      damageBullet.setDmg(25);

      const spartialEnemys = this.world.getComponent(
        this.gameState.enemyIDs[0],
        Spartial
      );
      this.tempNumber = spartialEnemys.pos.distance(spartialPlayer.pos);
      this.tempVec2
        .setVector(spartialEnemys.pos)
        .subVector(spartialPlayer.pos)
        .nor();

      for (let i = 0; i < this.gameState.enemyIDs.length; i++) {
        const spartialEnemys = this.world.getComponent(
          this.gameState.enemyIDs[i],
          Spartial
        );
        if (
          this.tempNumber >= spartialEnemys.pos.distance(spartialPlayer.pos)
        ) {
          this.tempNumber = spartialEnemys.pos.distance(spartialPlayer.pos);
          this.tempVec2
            .setVector(spartialEnemys.pos)
            .subVector(spartialPlayer.pos)
            .nor();
        }
      }
      spartialBullet.setPos(spartialPlayer.pos.x, spartialPlayer.pos.y);
      spartialBullet.setRadius(10);

      moveAbleBullet.setDirection(this.tempVec2.x, this.tempVec2.y);
      moveAbleBullet.speed = 15;

      if (this.levelState.currentLevel >= 5) {
        for (let i = -1; i <= 1; i += 2) {
          const bulletArchetype = new Archetype([Spartial, Moveable, Damage]);
          const bullet = this.world.createEntityByArchetype(bulletArchetype);
          this.gameState.bulletIDs.push(bullet);
          const spartialBullet = this.world.getComponent(
            this.gameState.bulletIDs[this.gameState.bulletIDs.length - 1],
            Spartial
          );
          const moveAbleBullet = this.world.getComponent(
            this.gameState.bulletIDs[this.gameState.bulletIDs.length - 1],
            Moveable
          );
          const damageBullet = this.world.getComponent(
            this.gameState.bulletIDs[this.gameState.bulletIDs.length - 1],
            Damage
          );

          damageBullet.setDmg(20);

          const spartialEnemys = this.world.getComponent(
            this.gameState.enemyIDs[0],
            Spartial
          );
          this.tempNumber = spartialEnemys.pos.distance(spartialPlayer.pos);
          this.tempVec2
            .setVector(spartialEnemys.pos)
            .subVector(spartialPlayer.pos)
            .nor();

          for (let i = 0; i < this.gameState.enemyIDs.length; i++) {
            const spartialEnemys = this.world.getComponent(
              this.gameState.enemyIDs[i],
              Spartial
            );
            if (
              this.tempNumber >= spartialEnemys.pos.distance(spartialPlayer.pos)
            ) {
              this.tempNumber = spartialEnemys.pos.distance(spartialPlayer.pos);
              this.tempVec2
                .setVector(spartialEnemys.pos)
                .subVector(spartialPlayer.pos)
                .nor();
            }
          }
          spartialBullet.setPos(spartialPlayer.pos.x, spartialPlayer.pos.y);
          spartialBullet.setRadius(10);

          moveAbleBullet.setDirection(this.tempVec2.x, this.tempVec2.y);
          moveAbleBullet.direction.rotate(-10 * i);
          moveAbleBullet.speed = 15;
        }
      }

      this.time = 0;
    }
  }
}
