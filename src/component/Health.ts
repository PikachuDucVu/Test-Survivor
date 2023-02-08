import { Component } from "flat-ecs";

export class Health extends Component {
  hp: number;
  maxHP: number;

  setHp(hp: number) {
    this.hp = hp;
  }
  setMaxHP(maxHP: number) {
    this.maxHP = maxHP;
  }
}
