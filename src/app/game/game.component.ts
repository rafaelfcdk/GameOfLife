import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { GameserveService } from "../services/gameserve.service";
import { ActivatedRoute } from "@angular/router";
import { isUndefined } from "util";
import { Location } from "@angular/common";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"]
})
export class GameComponent implements OnInit {
  constructor(
    private mGameServ: GameserveService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    location: Location
  ) {}

  @ViewChild("myCanvas") canvas: ElementRef;
  playing: Boolean = false;
  private sub;
  private chars: string =
    "0123456789abcdefghjklmnopqstuvxyzABCDEFGHJKLMNOPQSTUVXYZ";
  ngOnInit() {
    this.setBoard();
    this.route.params.subscribe(paramMap => {
      let v: string = paramMap.id;
      if (!isUndefined(v))
        if (v.length > 0 && v.length % 3 == 0) {
          this.mGameServ.board.clear();
          let board = this.mGameServ.getBoard();
          for (let i = 0; i < v.length; i += 3) {
            board[this.ston(v.substr(i, 3))] = 1;
          }
          this.setBoard();
        }
    });
  }
  toNext() {
    this.mGameServ.stepFoward();
    this.setBoard();

    if (this.playing) setTimeout(() => this.toNext(), 0);
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
    let w = this.mGameServ.board.w;
    let board = this.mGameServ.getBoard();
    for (let i = 0; i < board.length; i++) {
      if (board[i] == 1) {
        v += this.ntos(i).padStart(3, "0");
      }
    }
    this.copyToClipboard(location.origin + "/" + v);
    this.snackBar.open("Link copied to clipboard!", null, { duration: 1000 });
  }

  ntos(i: number): string {
    if (i < this.chars.length) return this.chars.charAt(i);
    return (
      this.ntos(Math.floor(i / this.chars.length)) +
      this.ntos(i % this.chars.length)
    );
  }

  ston(s: string): number {
    let v = 0;
    let p = 1;
    for (let i = s.length - 1; i >= 0; i--) {
      v = v + this.chars.indexOf(s.charAt(i)) * p;
      p *= this.chars.length;
    }
    return v;
  }

  copyToClipboard(v: string) {
    const el = document.createElement("textarea");
    el.value = v;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  }
}
