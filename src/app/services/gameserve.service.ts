import { Injectable } from "@angular/core";
import { GameModel } from "../shared/gamemodel";
@Injectable({
  providedIn: "root"
})
export class GameserveService {
  board: GameModel;
  constructor() {
    this.board = new GameModel();
    this.board.fillRandom();
  }

  toString(): string {
    let r = "";
    for (let j = 0; j < this.board.h; j++) {
      for (let i = 0; i < this.board.w; i++) {
        r += " " + this.board.get(i, j).toString();
      }
      r += " \n ";
    }
    return r;
  }
  changeState(i: number) {
    let x = i % this.board.w;
    let y = Math.floor(i / this.board.w);
    this.board.set(x, y, this.board.get(x, y) == 1 ? 0 : 1);
  }
  getBoard(): number[] {
    return this.board.getBoard();
  }

  stepFoward() {
    this.board.stepFoward();
  }
}
