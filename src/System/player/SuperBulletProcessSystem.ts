import { System, Inject, Archetype } from "flat-ecs";
import { Vector2 } from "gdxts";
import { Damage } from "../../component/Damage";
import { Health } from "../../component/Health";
import { Moveable } from "../../component/Movable";
import { Spartial } from "../../component/Spatial";
import { ConfigGame } from "../../dto/ConfigGame";
import { GameState } from "../../dto/GameState";
import { LevelState } from "../../dto/LevelState";

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export class SuperBulletProcessSystem extends System {
  @Inject("gameState") gameState: GameState;
  @Inject("configGame") configGame: ConfigGame;
  @Inject("levelState") levelState: LevelState;

  time = 0;
  tempNumber: number = 0;
  tempVec2 = new Vector2();

  process(): void {
    this.time += this.world.delta;

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
          spartialEnemy.pos.x <= spartialBullet.pos.x + spartialBullet.radius &&
          spartialEnemy.pos.x >= spartialBullet.pos.x - spartialBullet.radius &&
          spartialEnemy.pos.y <= spartialBullet.pos.y + spartialBullet.radius &&
          spartialEnemy.pos.y >= spartialBullet.pos.y - spartialBullet.radius
        ) {
          // this.world.deleteEntity(this.gameState.superBulletIDs[i]);
          heathEnemy.hp = Math.max(heathEnemy.hp - damageBullet.damage, 0);
          // this.gameState.superBulletIDs.splice(i, 1);
          //   for (let i = 0; i < 8; i++) {
          //     const tempBulletArchetype = new Archetype([
          //       Spartial,
          //       Moveable,
          //       Damage,
          //     ]);
          //     const tempBullet =
          //       this.world.createEntityByArchetype(tempBulletArchetype);
          //     this.gameState.tempBullet.push(tempBullet);
          //     const spartialTempBullet = this.world.getComponent(
          //       this.gameState.tempBullet[this.gameState.tempBullet.length - 1],
          //       Spartial
          //     );
          //     const moveableTempBullet = this.world.getComponent(
          //       this.gameState.tempBullet[this.gameState.tempBullet.length - 1],
          //       Moveable
          //     );
          //     const damageTempBullet = this.world.getComponent(
          //       this.gameState.tempBullet[this.gameState.tempBullet.length - 1],
          //       Damage
          //     );
          //     damageTempBullet.setDmg(25);
          //     // moveAblesuperBullet.setDirection(this.tempVec2.x, this.tempVec2.y);
          //     // moveAblesuperBullet.speed = 15;
          //     spartialTempBullet.setPos(75, 75);
          //     spartialTempBullet.setRadius(15);
          //     spartialTempBullet.setRotation((360 / 8) * i);
          //     spartialTempBullet.pos.rotate(spartialTempBullet.rotation);
          //     spartialTempBullet.pos.addVector(spartialEnemy.pos)
          //     // moveAblesuperBullet.setDirection(this.tempVec2.x, this.tempVec2.y);
          //     // moveAblesuperBullet.speed = 15;
          //   }
        }

        //Out of ScreenGame
        const spartialPlayer = this.world.getComponent(
          this.gameState.playerID,
          Spartial
        );
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
