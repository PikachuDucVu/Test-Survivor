import { Archetype, Inject, System } from "flat-ecs";
import { Vector2 } from "gdxts";
import { Damage } from "../../component/Damage";
import { Moveable } from "../../component/Movable";
import { Spartial } from "../../component/Spatial";
import { ConfigGame } from "../../dto/ConfigGame";
import { GameState } from "../../dto/GameState";
import { JoyStick } from "../../dto/JoyStick";
import { LevelState } from "../../dto/LevelState";

export class SuperBulletSpawningSystem extends System {
  @Inject("configGame") configGame: ConfigGame;
  @Inject("joyStick") joyStick: JoyStick;
  @Inject("gameState") gameState: GameState;
  @Inject("levelState") levelState: LevelState;
  
  time = 0;
  tempNumber = 0;
  tempVec2 = new Vector2();
  offset = 175;
  
  process(): void {
    this.time += this.world.delta;
    
    const spartialPlayer = this.world.getComponent(
      this.gameState.playerID,
      Spartial
    );
    if (
      this.time >= this.configGame.bigBallCooldown &&
      this.gameState.enemyIDs.length &&
      this.levelState.currentLevel >= 10
    ) {

      const BigBallArchetype = new Archetype([Spartial, Moveable, Damage]);
      const BigBall = this.world.createEntityByArchetype(BigBallArchetype);
      this.gameState.superBulletIDs.push(BigBall);
      const spartialBigBall = this.world.getComponent(
        this.gameState.superBulletIDs[this.gameState.superBulletIDs.length - 1],
        Spartial
      );
      const moveAbleBigBall = this.world.getComponent(
        this.gameState.superBulletIDs[this.gameState.superBulletIDs.length - 1],
        Moveable
      );
      const damageBigBall = this.world.getComponent(
        this.gameState.superBulletIDs[this.gameState.superBulletIDs.length - 1],
        Damage
      );

      damageBigBall.setDmg(15);
      spartialBigBall.pos.set(this.offset, this.offset);
      spartialBigBall.pos.rotate(
        (spartialBigBall.rotation -= this.configGame.speedProtectBall)
      );
      spartialBigBall.pos.addVector(spartialPlayer.pos);
      


    }
      
  }
}
