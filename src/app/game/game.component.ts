import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { GameserveService } from "../services/gameserve.service";
import { ActivatedRoute } from "@angular/router";
import { convert, deconvert } from "../shared/convertbase";
import { isUndefined } from "util";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"]
})
export class GameComponent implements OnInit {
  constructor(
    private mGameServ: GameserveService,
    private route: ActivatedRoute
  ) {}

  @ViewChild("myCanvas") canvas: ElementRef;
  playing: Boolean = false;
  private sub;
  ngOnInit() {
    this.setBoard();

    this.route.params.subscribe(paramMap => {
      let v: string = paramMap.id;
      if (!isUndefined(v))
        if (v.length > 0 && v.length % 2 == 0) {
          let ones: number[] = new Array(v.length / 2);
          for (let i = 0; i < v.length; i += 2) {
            ones[Math.floor(i / 2)] = deconvert(v.substring(i, i + 1));
          }
          this.mGameServ.board.clear();
          let board = this.mGameServ.getBoard();
          for (let i = 0; i < ones.length; i += 2) {
            board[ones[i]] = 1;
          }
          this.setBoard();
        }
    });
  }
  toNext() {
    this.mGameServ.stepFoward();
    this.setBoard();

    if (this.playing) window.requestAnimationFrame(() => this.toNext());
  }
  private setBoard() {
    let board = this.mGameServ.getBoard();
    let ctx: CanvasRenderingContext2D = this.canvas.nativeElement.getContext(
      "2d"
    );
    let w = this.mGameServ.board.w;
    let dw = this.canvas.nativeElement.width / w;
    for (let i = 0; i < board.length; i++) {
      ctx.beginPath();
      if (board[i] == 0) {
        ctx.fillStyle = "#FFF";
      } else ctx.fillStyle = "#000";
      ctx.strokeStyle = "#CCC";
      ctx.strokeStyle = "10px";
      ctx.rect((i % w) * dw, Math.floor(i / w) * dw, dw, dw);
      ctx.stroke();
      ctx.fill();
    }
  }

  toggleTimer() {
    this.playing = !this.playing;
    if (this.playing) {
      window.requestAnimationFrame(() => this.toNext());
    }
  }
  clearBoard() {
    this.mGameServ.board.clear();
    this.setBoard();
    if (this.playing) this.toggleTimer();
  }
  fillRandom() {
    this.mGameServ.board.fillRandom();
    this.setBoard();
  }
  activate(e: MouseEvent) {
    let w = this.mGameServ.board.w;
    let dw = this.canvas.nativeElement.width / w;
    let i = Math.floor(e.offsetX / dw) + Math.floor(e.offsetY / dw) * w;
    this.mGameServ.changeState(i);
    this.setBoard();
  }
  encode() {
    if (this.playing) this.toggleTimer();
    let v: string = "";
    let board = this.mGameServ.getBoard();
    for (let i = 0; i < board.length; i++) {
      if (board[i] == 1) {
        v += convert(i).padStart(2, "0");
      }
    }
  }
}
