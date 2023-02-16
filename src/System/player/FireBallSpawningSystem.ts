import { Archetype, Inject, System } from "flat-ecs";
import { Vector2 } from "gdxts";
import { Damage } from "../../component/Damage";
import { Moveable } from "../../component/Movable";
import { Spartial } from "../../component/Spatial";
import { Constants } from "../../Constant";
import { ConfigGame } from "../../dto/ConfigGame";
import { CurrentSkillLevel } from "../../dto/CurrentSkillLevel";
import { GameState } from "../../dto/GameState";

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export class FireBallSpawningSystem extends System {
  @Inject("gameState") gameState: GameState;
  @Inject("configGame") configGame: ConfigGame;
  @Inject("currentSkillLevel") currentSkillLevel: CurrentSkillLevel;
  tempVec2 = new Vector2();

  time = 0;

  process(): void {
    this.time += this.world.delta;

    if (
      this.time >= this.configGame.fireBallAttackSpeed &&
      this.currentSkillLevel.skill3
    ) {
      if (this.gameState.fireBallIDs.length >= 6) {
        this.world.deleteEntity(this.gameState.fireBallIDs[0]);
        this.gameState.fireBallIDs.splice(0, 1);
      }
      const fireBallArchetype = new Archetype([Spartial, Moveable, Damage]);
      const fireBall = this.world.createEntityByArchetype(fireBallArchetype);
      this.gameState.fireBallIDs.push(fireBall);

      const spartialPlayer = this.world.getComponent(
        this.gameState.playerID,
        Spartial
      );

      const spartialFireBall = this.world.getComponent(
        this.gameState.fireBallIDs[this.gameState.fireBallIDs.length - 1],
        Spartial
      );
      const moveAbleFireBall = this.world.getComponent(
        this.gameState.fireBallIDs[this.gameState.fireBallIDs.length - 1],
        Moveable
      );
      const damageFireBall = this.world.getComponent(
        this.gameState.fireBallIDs[this.gameState.fireBallIDs.length - 1],
        Damage
      );
      damageFireBall.setDmg(2 * this.currentSkillLevel.skill3);
      this.tempVec2.set(
        getRandomInt(
          spartialPlayer.pos.x - Constants.SCREEN_WIDTH / 2 - 200,
          spartialPlayer.pos.x + Constants.SCREEN_WIDTH / 2 + 200
        ),
        getRandomInt(
          spartialPlayer.pos.y - Constants.SCREEN_HEIGHT / 2 - 200,
          spartialPlayer.pos.y + Constants.SCREEN_HEIGHT / 2 + 200
        )
      );

      moveAbleFireBall.setTarget(this.tempVec2.x, this.tempVec2.y);
      this.tempVec2.subVector(spartialPlayer.pos).nor();
      moveAbleFireBall.setDirection(this.tempVec2.x, this.tempVec2.y);
      moveAbleFireBall.speed = 10;

      spartialFireBall.setPos(spartialPlayer.pos.x, spartialPlayer.pos.y);
      spartialFireBall.setRadius(17 * (1.75 + this.currentSkillLevel.skill3));

      this.time = 0;
    }
  }
}
