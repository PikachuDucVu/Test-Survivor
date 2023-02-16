import { Archetype, Inject, System } from "flat-ecs";
import { InputEvent, OrthoCamera, Vector2, ViewportInputHandler } from "gdxts";
import { Damage } from "../component/Damage";
import { Health } from "../component/Health";
import { Spartial } from "../component/Spatial";
import { ConfigGame } from "../dto/ConfigGame";
import { CurrentSkillLevel } from "../dto/CurrentSkillLevel";
import { GameState } from "../dto/GameState";
import { JoyStick } from "../dto/JoyStick";
import { LevelState } from "../dto/LevelState";

export class UpdateSkillProgressSystem extends System {
  @Inject("gameState") gameState: GameState;
  @Inject("levelState") levelState: LevelState;
  @Inject("inputHandler") inputHandler: ViewportInputHandler;
  @Inject("currentSkillLevel") currentSkillLevel: CurrentSkillLevel;
  @Inject("cameraUI") cameraUI: OrthoCamera;
  @Inject("joyStick") joyStick: JoyStick;
  @Inject("configGame") configGame: ConfigGame;

  tempVec2 = new Vector2();
  protectBallArchetype = new Archetype([Spartial, Damage]);
  offsetProtectBall = 100;
  offsetTouch = 175;
  defaultAttackSpeed = 0;

  initialized(): void {
    this.defaultAttackSpeed = this.configGame.attackSpeed;

    this.inputHandler.addEventListener(InputEvent.TouchStart, () => {
      //checkPause
      this.tempVec2 = this.inputHandler.getTouchedWorldCoord(this.cameraUI);
      const healthPlayer = this.world.getComponent(
        this.gameState.playerID,
        Health
      );
      console.log(this.tempVec2);

      //Buttonup1
      if (
        this.tempVec2.x >= 70 + this.offsetTouch * 0 &&
        this.tempVec2.x <= 150 + this.offsetTouch * 0 &&
        this.tempVec2.y >= 180 &&
        this.tempVec2.y <= 250 &&
        healthPlayer.hp > 0 &&
        this.currentSkillLevel.point >= 1 &&
        this.currentSkillLevel.skill1 < 5
      ) {
        this.currentSkillLevel.point -= 1;
        this.currentSkillLevel.skill1 += 1;
        this.configGame.attackSpeed =
          this.defaultAttackSpeed - 0.075 * this.currentSkillLevel.skill1;
      }

      //Buttondown1
      if (
        this.tempVec2.x >= 70 &&
        this.tempVec2.x <= 150 &&
        this.tempVec2.y >= 80 &&
        this.tempVec2.y <= 135 &&
        healthPlayer.hp > 0 &&
        this.currentSkillLevel.skill1 > 0
      ) {
        this.currentSkillLevel.point += 1;
        this.currentSkillLevel.skill1 -= 1;
        this.configGame.attackSpeed =
          this.defaultAttackSpeed - 0.075 * this.currentSkillLevel.skill1;
      }

      //Buttonup2
      if (
        this.tempVec2.x >= 70 + this.offsetTouch * 1 &&
        this.tempVec2.x <= 150 + this.offsetTouch * 1 &&
        this.tempVec2.y >= 180 &&
        this.tempVec2.y <= 250 &&
        healthPlayer.hp > 0 &&
        this.currentSkillLevel.point >= 1 &&
        this.currentSkillLevel.skill2 < 5
      ) {
        this.currentSkillLevel.point -= 1;
        this.currentSkillLevel.skill2 += 1;
        for (let i = this.currentSkillLevel.skill2; i >= 0; i--) {
          this.world.deleteEntity(this.gameState.protectBall[i]);
          this.gameState.protectBall.splice(i, 1);
        }
        for (let i = 0; i < this.currentSkillLevel.skill2; i++) {
          const protectBall = this.world.createEntityByArchetype(
            this.protectBallArchetype
          );
          this.gameState.protectBall.push(protectBall);
          const damageProtectBall = this.world.getComponent(
            protectBall,
            Damage
          );
          damageProtectBall.setDmg(5 * this.currentSkillLevel.skill2);
          const spartialProtectBall = this.world.getComponent(
            protectBall,
            Spartial
          );
          spartialProtectBall.pos.set(
            this.offsetProtectBall,
            this.offsetProtectBall
          );
          spartialProtectBall.setRadius(15);
          spartialProtectBall.setRotation(
            (360 / this.currentSkillLevel.skill2) * i
          );
        }
      }

      //Buttondown2
      if (
        this.tempVec2.x >= 70 + this.offsetTouch * 1 &&
        this.tempVec2.x <= 150 + this.offsetTouch * 1 &&
        this.tempVec2.y >= 80 &&
        this.tempVec2.y <= 135 &&
        healthPlayer.hp > 0 &&
        this.currentSkillLevel.skill2 > 0
      ) {
        this.currentSkillLevel.point += 1;
        this.currentSkillLevel.skill2 -= 1;
        for (let i = this.currentSkillLevel.skill2; i >= 0; i--) {
          this.world.deleteEntity(this.gameState.protectBall[i]);
          this.gameState.protectBall.splice(i, 1);
        }
        for (let i = 0; i < this.currentSkillLevel.skill2; i++) {
          const protectBall = this.world.createEntityByArchetype(
            this.protectBallArchetype
          );
          this.gameState.protectBall.push(protectBall);
          const damageProtectBall = this.world.getComponent(
            protectBall,
            Damage
          );
          damageProtectBall.setDmg(5 * this.currentSkillLevel.skill2);
          const spartialProtectBall = this.world.getComponent(
            protectBall,
            Spartial
          );
          spartialProtectBall.pos.set(
            this.offsetProtectBall,
            this.offsetProtectBall
          );
          spartialProtectBall.setRadius(15);
          spartialProtectBall.setRotation(
            (360 / this.currentSkillLevel.skill2) * i
          );
        }
      }

      //Buttonup3
      if (
        this.tempVec2.x >= 70 + this.offsetTouch * 2 &&
        this.tempVec2.x <= 150 + this.offsetTouch * 2 &&
        this.tempVec2.y >= 180 &&
        this.tempVec2.y <= 250 &&
        healthPlayer.hp > 0 &&
        this.currentSkillLevel.point >= 2 &&
        this.currentSkillLevel.skill3 < 5
      ) {
        this.currentSkillLevel.point -= 2;
        this.currentSkillLevel.skill3 += 1;
      }

      //Buttondown3
      if (
        this.tempVec2.x >= 70 + this.offsetTouch * 2 &&
        this.tempVec2.x <= 150 + this.offsetTouch * 2 &&
        this.tempVec2.y >= 80 &&
        this.tempVec2.y <= 135 &&
        healthPlayer.hp > 0 &&
        this.currentSkillLevel.skill3 > 0
      ) {
        this.currentSkillLevel.point += 2;
        this.currentSkillLevel.skill3 -= 1;
        if (this.currentSkillLevel.skill3 === 0) {
          for (let i = this.gameState.fireBallIDs.length - 1; i >= 0; i--) {
            this.world.deleteEntity(this.gameState.fireBallIDs[i]);
            this.gameState.fireBallIDs.splice(i, 1);
          }
        }
      }

      //Buttonup4
      if (
        this.tempVec2.x >= 70 + this.offsetTouch * 3 &&
        this.tempVec2.x <= 150 + this.offsetTouch * 3 &&
        this.tempVec2.y >= 180 &&
        this.tempVec2.y <= 250 &&
        healthPlayer.hp > 0 &&
        this.currentSkillLevel.point >= 3 &&
        this.currentSkillLevel.skill4 < 5
      ) {
        this.currentSkillLevel.point -= 3;
        this.currentSkillLevel.skill4 += 1;
      }

      //Buttondown4
      if (
        this.tempVec2.x >= 70 + this.offsetTouch * 3 &&
        this.tempVec2.x <= 150 + this.offsetTouch * 3 &&
        this.tempVec2.y >= 80 &&
        this.tempVec2.y <= 135 &&
        healthPlayer.hp > 0 &&
        this.currentSkillLevel.skill4 > 0
      ) {
        this.currentSkillLevel.point += 3;
        this.currentSkillLevel.skill4 -= 1;
      }
    });
  }

  process(): void {}
}
