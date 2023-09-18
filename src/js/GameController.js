import themes from './themes';
import {generateTeam, generatePosition, getPositionsToMove, getPositionsToAttack, createCharacter} from './generators';
import PositionedCharacter from './PositionedCharacter';
import cursor from './cursors';
import GameState from './GameState';
import GamePlay from './GamePlay';



export default class GameController {
  constructor(gamePlay, stateService) {
    this.boardSize = 8;
    this.gamePlay = gamePlay;
    this.gameState = new GameState();
    this.stateService = stateService;
    this.characterList = [];
  }

  init() {

    this.startNewGame();

    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));

    this.gamePlay.addNewGameListener(this.startNewGame.bind(this));
    this.gamePlay.addSaveGameListener(this.saveGame.bind(this));
    this.gamePlay.addLoadGameListener(this.loadGame.bind(this));
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // TODO: react to click

    const characterInACell = this.characterList.find(character => character.position === index);
    const positionsToMove = getPositionsToMove(this.gameState.selectedCell, this.gameState.selectedCharacter, this.boardSize);
    const positionsToAttack = getPositionsToAttack(this.gameState.selectedCell, this.gameState.selectedCharacter, this.boardSize);
    
    if(this.gameState.turn === 'player' &&
      this.gameState.running) {
    if(characterInACell) {
      if(characterInACell.character.type === 'bowman' || characterInACell.character.type === 'swordsman' || characterInACell.character.type === 'magician') {
        this.gamePlay.deselectCell(this.gameState.selectedCell);
        this.gamePlay.selectCell(index, 'yellow');
        this.gameState.selectedCell = index;
        this.gameState.selectedCharacter = characterInACell.character.type;
      } else if(positionsToAttack.indexOf(index) >= 0) {
          let attacker = this.characterList.find(item => item.position === this.gameState.selectedCell).character;
          let target = characterInACell.character;
          let damage = Math.max((attacker.attack - target.defence) * 0.2, attacker.attack * 0.1);
          damage = Math.floor(damage);
          target.health -= damage;
          if(target.health < 1) {
            this.characterList = this.characterList.filter(item => item.position !== index);
          } 
          this.gamePlay.redrawPositions(this.characterList);
          this.gameState.changeTurn();
          this.gamePlay.showDamage(index, damage).then(()=> {
            setTimeout(() => {
              this.computerTurn();
              }, 1000);
          })
          if(this.teamSize('computer') === 0){
            if (this.gameState.level === 4) {
              this.gameState.running = false;
              GamePlay.showMessage('Победа');
              return;
            }
            this.gameState.level += 1;
            this.gameState.selectedCell = 0;
            this.gameState.selectedCharacter = 0;
            this.characterList = [];
            this.levelUp();
            this.startNextLevel();
          }
      } else {
        GamePlay.showError('Нельзя выбрать персонажей противника');
      }
    } else if (positionsToMove.indexOf(index) >= 0) {
      this.characterList.map(item => {
        if (item.position === this.gameState.selectedCell) {
          item.position = index;
          this.gamePlay.deselectCell(this.gameState.selectedCell);
          this.gameState.selectedCell = index;
          this.gamePlay.selectCell(index, 'yellow');
        }
      })
      this.gamePlay.redrawPositions(this.characterList);
      this.gameState.changeTurn();
      setTimeout(() => {
        this.computerTurn();
        }, 1000);
    }else { 
      GamePlay.showError('Пустая клетка');
    }
  }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter

    const characterInACell = this.characterList.find(character => character.position === index);
    const positionsToMove = getPositionsToMove(this.gameState.selectedCell, this.gameState.selectedCharacter, this.boardSize);
    const positionsToAttack = getPositionsToAttack(this.gameState.selectedCell, this.gameState.selectedCharacter, this.boardSize);


    if(characterInACell) {
      const message = this.characterInfo(characterInACell);
      
      this.gamePlay.setCursor(cursor.pointer);
      this.gamePlay.showCellTooltip(message, index);
    
      if(characterInACell.character.type === 'undead' ||
        characterInACell.character.type === 'vampire' ||
        characterInACell.character.type === 'daemon') {
          if(positionsToAttack.indexOf(index) >= 0) {
            this.gamePlay.setCursor(cursor.crosshair);
          } else {
            this.gamePlay.setCursor(cursor.notallowed);
          }
        }
    } else {
      if (positionsToMove.indexOf(index) >= 0) {
        this.gamePlay.selectCell(index, 'green');
        this.gamePlay.setCursor(cursor.pointer);
      }
    }
  }


  

  onCellLeave(index) {
    // TODO: react to mouse leave

    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.setCursor(cursor.auto);
    if (index !== this.gameState.selectedCell) {
      this.gamePlay.deselectCell(index);
    }
  }

  startNewGame() {
    this.clearAll();
    this.startNextLevel();
  }

  fieldRendering(level) {
    let theme = '';

    if(level === 1) {
      theme = themes.prairie;
    }
    if(level === 2) {
      theme = themes.desert;
    }
    if(level === 3) {
      theme = themes.arctic;
    }
    if(level === 4) {
      theme = themes.mountain;
    }
    this.gamePlay.drawUi(theme);
  }

  generateNewTeam(player) {
    if (player === 'player') {
      this.playerTeam = generateTeam(['bowman', 'swordsman', 'magician'], this.gameState.level, 3);
    }
    if (player === 'computer') {
      this.computerTeam = generateTeam(['vampire', 'undead', 'daemon'], this.gameState.level, 3);
    }
  }

  positionTeam(player) { 
    let team; 
    const usedPositions = []; 

    if (player === 'player') {
      team = this.playerTeam.characters;
    }
    if (player === 'computer') {
      team = this.computerTeam.characters;
    }
    
    for (let character of team) {

      const position = generatePosition(player, usedPositions, this.boardSize);
      usedPositions.push(position);

      const positionedCharacter = new PositionedCharacter(character, position);
      this.characterList.push(positionedCharacter);
    }
  }

  drawingCharacters() { 
    this.gamePlay.redrawPositions(this.characterList);
  }

  characterInfo(character) {
    return `🎖${character.character.level} ⚔${character.character.attack} 🛡${character.character.defence} ❤${character.character.health}`;
  }

  levelUp() {
    let i = 0;
    for (let item of this.characterList) {
      const character = item.character;
      character.level += 1;
      character.attack = Math.max(character.attack, character.attack * (80 + character.health) / 100);
      character.attack = Math.floor(character.attack);
      character.defence = Math.max(character.defence, character.defence * (80 + character.health) / 100);
      character.defence = Math.floor(character.defence);
      character.health = character.health + 80 <= 100 ? character.health + 80 : 100;
      item.character = character;
      this.characterList[i] = item;
      i++;
    }
  }

  startNextLevel() { 
    this.fieldRendering(this.gameState.level); 
    this.generateNewTeam('computer');
    this.generateNewTeam('player');
    this.positionTeam('player');
    this.positionTeam('computer');
    this.drawingCharacters();
  }

  teamSize(player) {
    let size = 0;
    if (player === 'player') {
      for (const char of this.characterList) {
        if (char.character.type === 'bowman' ||
            char.character.type === 'swordsman' ||
            char.character.type === 'magician') {
          size += 1;
        }
      }
      return size;
    }
    if (player === 'computer') {
      for (const char of this.characterList) {
        if (char.character.type === 'undead' ||
            char.character.type === 'vampire' ||
            char.character.type === 'daemon') {
          size += 1;
        }
      }
      return size;
    }
  }

  computerTurn() {
    const playerTeam = [];
    const computerTeam = [];
    const playerTeamPositions = [];
    const computerTeamPositions = [];

    for (let character of this.characterList) {
      if (character.character.type === 'bowman' 
      || character.character.type === 'swordsman'
      || character.character.type === 'magician') {
        playerTeam.push(character);
        playerTeamPositions.push(character.position);
      }
      if (character.character.type === 'undead'
      || character.character.type === 'vampire'
      || character.character.type === 'daemon') {
        computerTeam.push(character);
        computerTeamPositions.push(character.position);
      }
    
      for (let character of computerTeam) {
        const attacker = character.character;
        const positionsToAttack = getPositionsToAttack(character.position, character.character.type, this.boardSize);
      
        for (let character of playerTeam) {
          if(positionsToAttack.indexOf(character.position) >= 0) {
            let target = character;
            let damage = Math.max((attacker.attack - target.character.defence) * 0.2, attacker.attack * 0.1);
            damage = Math.floor(damage);
            target.character.health -= damage;
            if (target.character.health < 1) {
              this.gamePlay.deselectCell(target.position);
              this.characterList = this.characterList.filter(item => item.position !== target.position);
              this.gamePlay.redrawPositions(this.characterList);
            }
            if(this.teamSize('player') === 0) {
              if (this.gameState.level === 4) {
                this.gameState.running = false;
                GamePlay.showMessage('Вы проиграли');
                return;
              }
              this.gameState.level += 1;
              this.levelUp();
              this.gamePlay.deselectCell(this.gameState.selectedCell);
              this.startNextLevel()
            }
            this.gamePlay.showDamage(target.position, damage).then(()=> {
              setTimeout(() => {
                this.gameState.changeTurn();
                }, 1000);
            });
            return;
          } 
        }
      }
    }
    let rnd = Math.floor(Math.random() * computerTeam.length);
            const char = computerTeam[rnd];
            let positionsToMove = getPositionsToMove(char.position, char.character.type, this.boardSize);
            positionsToMove = positionsToMove.filter((element) => !computerTeamPositions.includes(element));
            rnd = Math.floor(Math.random() * positionsToMove.length);
            char.position = positionsToMove[rnd];
            this.gamePlay.redrawPositions(this.characterList);
            this.gameState.changeTurn();
            return;
  }

  clearAll() {
    this.playerTeam = [];
    this.computerTeam = [];
    this.characterList = [];
    this.gameState.level = 1;
    this.gameState.running = true;
  }

  saveGame() { 
    const state = {};
    state.running = this.gameState.running;
    state.level = this.gameState.level;
    state.turn = this.gameState.turn;
    state.selectedCell = this.gameState.selectedCell;
    state.selectedCharacter = this.gameState.selectedCharacter;
    state.characterList = this.characterList;
    this.stateService.save(state);
    GamePlay.showMessage('Игра сохранена');
  }

  loadGame() { 
    try {
      const state = this.stateService.load();
      this.gameState.running = state.running;
      this.gameState.level = state.level;
      this.gameState.turn = state.turn;
      this.gamePlay.deselectCell(this.gameState.selectedCell);
      this.gameState.selectedCell = state.selectedCell;
      if (this.gameState.selectedCell) {
        this.gamePlay.selectCell(this.gameState.selectedCell, 'yellow');
      }
      this.gameState.selectedCharacter = state.selectedCharacter;
      this.characterList = []; 
      const tempArr = state.characterList;
      tempArr.map(char => {
        const character = createCharacter(char.character.level, char.character.type);
        character.attack = char.character.attack;
        character.defence = char.character.defence;
        character.health = char.character.health;
        const positionedCharacter = new PositionedCharacter(character, char.position);
        this.characterList.push(positionedCharacter);
      });
      this.fieldRendering(this.gameState.level);
      this.gamePlay.redrawPositions(this.characterList);
      GamePlay.showMessage('Игра загружена');
    } 
    catch {
      GamePlay.showError('Нет сохранённой игры');
    }
  }
}