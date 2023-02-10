import { System, Inject, Archetype } from "flat-ecs";
import { Vector2 } from "gdxts";
import { Damage } from "../../component/Damage";
import { Health } from "../../component/Health";
import { Moveable } from "../../component/Movable";
import { Spartial } from "../../component/Spatial";
import { ConfigGame } from "../../dto/ConfigGame";
import { GameState } from "../../dto/GameState";
import { LevelState } from "../../dto/LevelState";

export class BulletProcessSystem extends System {
  @Inject("gameState") gameState: GameState;
  @Inject("configGame") configGame: ConfigGame;
  @Inject("levelState") levelState: LevelState;

  time = 0;
  tempNumber: number = 0;
  tempVec2 = new Vector2();
  offset = 2.5;

  process(): void {
    this.time += this.world.delta;

    //Del bullet out of screen game
    const spartialPlayer = this.world.getComponent(
      this.gameState.playerID,
      Spartial
    );
    for (let i = 0; i < this.gameState.bulletIDs.length; i++) {
      const spartialBullet = this.world.getComponent(
        this.gameState.bulletIDs[i],
        Spartial
      );
      if (spartialPlayer.pos.distance(spartialBullet.pos) > 1000) {
        this.world.deleteEntity(this.gameState.bulletIDs[i]);
        this.gameState.bulletIDs.splice(i, 1);
      }
    }

    for (let i = this.gameState.bulletIDs.length - 1; i >= 0; i--) {
      const spartialBullet = this.world.getComponent(
        this.gameState.bulletIDs[i],
        Spartial
      );
      const moveAbleBullet = this.world.getComponent(
        this.gameState.bulletIDs[i],
        Moveable
      );
      const damageBullet = this.world.getComponent(
        this.gameState.bulletIDs[i],
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
            spartialBullet.pos.x + spartialBullet.radius * this.offset &&
          spartialEnemy.pos.x >=
            spartialBullet.pos.x - spartialBullet.radius * this.offset &&
          spartialEnemy.pos.y <=
            spartialBullet.pos.y + spartialBullet.radius * this.offset &&
          spartialEnemy.pos.y >=
            spartialBullet.pos.y - spartialBullet.radius * this.offset
        ) {
          heathEnemy.hp = Math.max(heathEnemy.hp - damageBullet.damage, 0);
          this.world.deleteEntity(this.gameState.bulletIDs[i]);
          this.gameState.bulletIDs.splice(i, 1);
        }
      }
    }
  }
}
