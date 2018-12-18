export class GameModel {
  private board: number[];
  private start: number[];
  isBound = false;
  constructor(private cols: number = 71, private rows: number = 71) {
    this.board = new Array(cols * rows);
    this.start = new Array(cols * rows);
    this.board.fill(0);
    this.setStart();
  }

  fillRandom() {
    for (let j = 0; j < this.rows; j++)
      for (let i = 0; i < this.cols; i++) {
        if (Math.random() < 0.1) this.set(i, j, 0b1);
      }
  }

  setStart() {
    for (let i = 0; i < this.cols * this.rows; i++)
      this.start[i] = this.board[i];
  }
  loadStart() {
    for (let i = 0; i < this.cols * this.rows; i++)
      this.board[i] = this.start[i];
  }
  stepFoward() {
    for (let j = 0; j < this.rows; j++)
      for (let i = 0; i < this.cols; i++) {
        this.set(i, j, (this.nextState(i, j) << 1) | this.get(i, j));
      }
    for (let i = 0; i < this.cols * this.rows; i++)
      this.board[i] = this.board[i] >> 1;
  }
  stepBack() {}

  private nextState(i: number, j: number): number {
    let alive: number = 0;
    for (let ay = j - 1; ay < j + 2; ay++)
      for (let ax = i - 1; ax < i + 2; ax++)
        if (!this.isBound)
          alive +=
            this.get(
              (ax + this.cols) % this.cols,
              (ay + this.rows) % this.rows
            ) & 0b1;
        else if (ax >= 0 && ax < this.cols && ay >= 0 && ay < this.rows)
          alive += this.get(ax, ay) & 0b1;
    alive = (alive - this.get(i, j)) | this.get(i, j);

    if (alive == 0b11) alive = 1;
    else alive = 0;
    return alive;
  }

  get(i: number, j: number): number {
    return this.board[(i % this.cols) + j * this.cols];
  }
  set(i: number, j: number, value: number) {
    this.board[(i % this.cols) + j * this.cols] = value;
  }
  get w(): number {
    return this.cols;
  }
  get h(): number {
    return this.rows;
  }
  getBoard(): number[] {
    return this.board;
  }
  clear() {
    this.board.fill(0);
  }
}
