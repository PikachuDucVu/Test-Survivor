import { Inject, System } from "flat-ecs";
import { Health } from "../component/Health";
import { Moveable } from "../component/Movable";
import { Spartial } from "../component/Spatial";
import { ConfigGame } from "../dto/ConfigGame";
import { GameState } from "../dto/GameState";
import { JoyStick } from "../dto/JoyStick";

export class PlayerMovementSystem extends System {
  @Inject("gameState") gameState: GameState;
  @Inject("configGame") configGame: ConfigGame;
  @Inject("joyStick") joyStick: JoyStick;

  process(): void {
    const spartial = this.world.getComponent(this.gameState.playerID, Spartial);
    const moveAble = this.world.getComponent(this.gameState.playerID, Moveable);
    const health = this.world.getComponent(this.gameState.playerID, Health);

    if (health.hp <= 0) {
      this.configGame.stop = true;
    }

    if (this.joyStick.dragging) {
      // spartial.rotation = this.joyStick.direction.angle();
      spartial.pos.add(
        this.joyStick.direction.x * moveAble.speed,
        this.joyStick.direction.y * moveAble.speed
      );
      spartial.rotation =
        this.joyStick.direction.angle() < 0
          ? ((2 * Math.PI + this.joyStick.direction.angle()) * 180) / Math.PI
          : (this.joyStick.direction.angle() / Math.PI) * 180;
    }
    for (let i = 0; i < this.gameState.enemyIDs.length; i++) {
      const spartialEnemy = this.world.getComponent(
        this.gameState.enemyIDs[i],
        Spartial
      );

      if (
        spartial.pos.x <= spartialEnemy.pos.x + 50 &&
        spartial.pos.x >= spartialEnemy.pos.x - 50 &&
        spartial.pos.y <= spartialEnemy.pos.y + 50 &&
        spartial.pos.y >= spartialEnemy.pos.y - 50
      ) {
        health.hp -= 1;
      }
    }
  }
}
