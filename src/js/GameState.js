export default class GameState {
  constructor() {
    this.turn = 'player';
    this.selectedCell = 0;
    this.selectedCharacter = 0;
    this.level = 1;
    this.running = true;
  }

  changeTurn() {
    if(this.turn === 'player') {
      this.turn = 'compuetr';
    } else {
      this.turn = 'player';
    }
  }
}
