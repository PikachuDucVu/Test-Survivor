import { System, Inject, Archetype } from "flat-ecs";
import { Vector2 } from "gdxts";
import { Damage } from "../../component/Damage";
import { Health } from "../../component/Health";
import { Moveable } from "../../component/Movable";
import { Spartial } from "../../component/Spatial";
import { ConfigGame } from "../../dto/ConfigGame";
import { CurrentSkillLevel } from "../../dto/CurrentSkillLevel";
import { GameState } from "../../dto/GameState";
import { LevelState } from "../../dto/LevelState";

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export class SuperBulletProcessSystem extends System {
  @Inject("gameState") gameState: GameState;
  @Inject("configGame") configGame: ConfigGame;
  @Inject("levelState") levelState: LevelState;
  @Inject("currentSkillLevel") currentSkillLevel: CurrentSkillLevel;

  time = 0;
  tempNumber: number = 0;
  tempVec2 = new Vector2();

  process(): void {
    const spartialPlayer = this.world.getComponent(
      this.gameState.playerID,
      Spartial
    );
    for (let i = this.gameState.superBulletIDs.length - 1; i >= 0; i--) {
      const spartialBullet = this.world.getComponent(
        this.gameState.superBulletIDs[i],
        Spartial
      );
      const moveAbleBullet = this.world.getComponent(
        this.gameState.superBulletIDs[i],
        Moveable
      );
      const damageBullet = this.world.getComponent(
        this.gameState.superBulletIDs[i],
        Damage
      );

      spartialBullet.pos.add(
        moveAbleBullet.direction.x * moveAbleBullet.speed,
        moveAbleBullet.direction.y * moveAbleBullet.speed
      );
      //Collision
      for (let j = this.gameState.enemyIDs.length - 1; j >= 0; j--) {
        const spartialEnemy = this.world.getComponent(
          this.gameState.enemyIDs[j],
          Spartial
        );
        const heathEnemy = this.world.getComponent(
          this.gameState.enemyIDs[j],
          Health
        );
        if (
          spartialEnemy.pos.x <=
            spartialBullet.pos.x + spartialBullet.radius * 1.1 &&
          spartialEnemy.pos.x >=
            spartialBullet.pos.x - spartialBullet.radius * 1.1 &&
          spartialEnemy.pos.y <=
            spartialBullet.pos.y + spartialBullet.radius * 1.1 &&
          spartialEnemy.pos.y >=
            spartialBullet.pos.y - spartialBullet.radius * 1.1
        ) {
          // this.world.deleteEntity(this.gameState.superBulletIDs[i]);
          this.tempVec2
            .setVector(spartialEnemy.pos)
            .subVector(spartialPlayer.pos)
            .nor();
          spartialEnemy.pos.addVector(
            this.tempVec2.scale(7 + this.currentSkillLevel.skill3 * 2)
          );
          heathEnemy.hp = Math.max(heathEnemy.hp - damageBullet.damage, 0);
        }

        //Out of ScreenGame
        for (let i = 0; i < this.gameState.superBulletIDs.length; i++) {
          const spartialBullet = this.world.getComponent(
            this.gameState.superBulletIDs[i],
            Spartial
          );
          if (spartialPlayer.pos.distance(spartialBullet.pos) > 1500) {
            this.world.deleteEntity(this.gameState.superBulletIDs[i]);
            this.gameState.superBulletIDs.splice(i, 1);
          }
        }

        //tempBullet
        // for(let i = 0; i < this.gameState.tempBullet.length;i++){
        //   const spartialTempBullet = this.world.getComponent(
        //     this.gameState.tempBullet[this.gameState.tempBullet.length - 1],
        //     Spartial
        //   );
        //   spartialTempBullet.pos.
        // }
      }
    }
  }
}
