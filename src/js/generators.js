/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Magician from './characters/Magician';
import Undead from './characters/Undead';
import Daemon from './characters/Daemon';
import Vampire from './characters/Vampire';
import Team from './Team'; 
import { calcTileType } from './utils';

export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
  const randomType = allowedTypes[Math.floor(Math.random()*allowedTypes.length)];
  const randomLevel = Math.floor(Math.random()*maxLevel)+1;

  if(randomType === 'bowman') {
    yield new Bowman(randomLevel);
  }
  if(randomType === 'swordsman') {
    yield new Swordsman(randomLevel);
  }
  if(randomType === 'magician') {
    yield new Magician(randomLevel);
  }
  if(randomType === 'undead') {
    yield new Undead(randomLevel);
  }
  if(randomType === 'daemon') {
    yield new Daemon(randomLevel);
  }
  if(randomType === 'vampire') {
    yield new Vampire(randomLevel);
  }
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const characters = [];

  for(let i = 0; i < characterCount; i++) {
    characters.push(characterGenerator(allowedTypes, maxLevel).next().value);
  }
  return new Team(characters);
}

export function generatePosition(player, usedPositions, boardSize) {
  let index = 0; 
  const allowedPositions = []; 

  if (player === 'player') {
    index = 0;
  }
  if (player === 'computer') {
    index = boardSize - 2;
  }

  for (let i = 0; i < boardSize; i ++) {
    let position1 = (i * boardSize) + index;
    let position2 = (i * boardSize) + index + 1;
    
    if (!usedPositions.includes(position1)) {
      allowedPositions.push(position1);
    }
    if (!usedPositions.includes(position2)) {
      allowedPositions.push(position2);
    }
  }
  const randomPozition = Math.floor(Math.random() * allowedPositions.length);
  return allowedPositions[randomPozition];
}

function getMoveRange(stepCount, index, boardSize, direction) {
  let rangeList = [];
  let step;
  let getDirection = function(i, direction, index, boardSize) {
    let stepFormula;

      if(direction === 'top') {
        stepFormula = (index - boardSize*i);
      }
      if(direction === 'bottom') {
        stepFormula = (index + boardSize*i);
      }
      if(direction === 'left') {
        stepFormula = (index - i);
      }
      if(direction === 'right') {
        stepFormula = (index + i);
      }
      if(direction === 'top-left') {
        stepFormula = (index - (boardSize*i)-i);
      }
      if(direction === 'top-right') {
        stepFormula = (index - (boardSize*i)+i);
      }
      if(direction === 'bottom-left') {
        stepFormula = (index + (boardSize*i)-i);
      }
      if(direction === 'bottom-right') {
        stepFormula = (index + (boardSize*i)+i);
      }
    
      return stepFormula;
  }
  
  if(calcTileType(index, boardSize) === 'center') {
    for(let i = 1; i<= stepCount.length; i++) {
        step = getDirection(i, direction, index, boardSize);
        rangeList.push(step);
      if(calcTileType(step, boardSize) !== 'center') {
        break;
      }
    }
    return rangeList;
  } else if(calcTileType(index, boardSize) === 'top' ||
            calcTileType(index, boardSize) === 'left' ||
            calcTileType(index, boardSize) === 'right' ||
            calcTileType(index, boardSize) === 'bottom') {
      for(let i = 1; i<= stepCount.length; i++) {
        step = getDirection(i, direction, index, boardSize);
      if(calcTileType(step, boardSize) === calcTileType(index, boardSize) ||
        calcTileType(step, boardSize) === 'center') {
          rangeList.push(step);
      } else {
        rangeList.push(step);
        break;
      }
    }
    return rangeList;
  } else {
    for(let i = 1; i<= stepCount.length; i++) {
      step = getDirection(i, direction, index, boardSize);
      rangeList.push(step);
  }
    return rangeList;
 }
}

export function getPositionsToMove(index, character, boardSize) {
  let stepCount = [];
  let positionsToMove = [];

  let borders = ['top', 'top-right', 'top-left', 'left', 'right', 'bottom', 'bottom-left', 'bottom-right'];
  
  if(character === 'swordsman' || character === 'undead') {
    stepCount = [1];
  }
  if(character === 'bowman' || character === 'vampire') {
    stepCount = [1,2];
  }
  if(character === 'magician' || character === 'daemon') {
    stepCount = [1,2,3,4];
  }

  if(calcTileType(index, boardSize).includes('-')) {
    let a = calcTileType(index, boardSize).split('-');
    let b = borders.filter((element) => !element.includes(a[0]));
    let c = b.filter((element) => !element.includes(a[1]));

    c.forEach((element) => positionsToMove.push(...getMoveRange(stepCount, index, boardSize, element)));
  } else if(calcTileType(index, boardSize) === 'center') {
    borders.forEach((element) => positionsToMove.push(...getMoveRange(stepCount, index, boardSize, element)));
  } else {
    let a = borders.filter((element) => !element.includes(calcTileType(index, boardSize)));
    a.forEach((element) => positionsToMove.push(...getMoveRange(stepCount, index, boardSize, element)));
  }

  return positionsToMove;
}

function getAttackRange(stepCount, index, boardSize, direction) {
  let rangeList = [];
  let step;
  let getDirection = function(i, direction, index, boardSize) {
    let stepFormula;

      if(direction === 'top') {
        stepFormula = (index - boardSize*i);
      }
      if(direction === 'bottom') {
        stepFormula = (index + boardSize*i);
      }
      if(direction === 'left') {
        stepFormula = (index - i);
      }
      if(direction === 'right') {
        stepFormula = (index + i);
      }
      return stepFormula;
  }
    if(calcTileType(index, boardSize) === 'top-right' ||
      calcTileType(index, boardSize) === 'top-left' ||
      calcTileType(index, boardSize) === 'bottom-right' ||
      calcTileType(index, boardSize) === 'bottom-left') {
    for(let i = 1; i<= stepCount.length; i++) {
      step = getDirection(i, direction, index, boardSize);
      rangeList.push(step);
    }
    return rangeList;
    } else {
    for(let i = 1; i<= stepCount.length; i++) {
        step = getDirection(i, direction, index, boardSize);
      if(calcTileType(step, boardSize) === calcTileType(index, boardSize) ||
        calcTileType(step, boardSize) === 'center') {
          rangeList.push(step);
      } else {
        rangeList.push(step);
        break;
      }
    }
    return rangeList;
    }
}

export function getPositionsToAttack(index, character, boardSize) {
  let stepCount = [];
  let positionsToAttack = [];
  let yPositions = [];
  
  if(character === 'swordsman' || character === 'undead') {
    stepCount = [1];
  }
  if(character === 'bowman' || character === 'vampire') {
    stepCount = [1,2];
  }
  if(character === 'magician' || character === 'daemon') {
    stepCount = [1,2,3,4];
  }

  if(calcTileType(index, boardSize) === 'top-right' ||
    calcTileType(index, boardSize) === 'top-left' ||
    calcTileType(index, boardSize) === 'top') {
    yPositions.push(...getAttackRange(stepCount, index, boardSize, 'bottom'));
    yPositions.push(index);
  } else if(calcTileType(index, boardSize) === 'bottom-right' ||
    calcTileType(index, boardSize) === 'bottom-left' ||
    calcTileType(index, boardSize) === 'bottom') {
    yPositions.push(...getAttackRange(stepCount, index, boardSize, 'top'));
    yPositions.push(index);
  } else {
    yPositions.push(...getAttackRange(stepCount, index, boardSize, 'top'));
    yPositions.push(...getAttackRange(stepCount, index, boardSize, 'bottom'));
    yPositions.push(index);
  }

  if(calcTileType(index, boardSize) === 'top-right' || 
    calcTileType(index, boardSize) === 'right' ||
    calcTileType(index, boardSize) === 'bottom-right') {
    yPositions.forEach((element) => positionsToAttack.push(...getAttackRange(stepCount, element, boardSize, 'left')));
  } else if(calcTileType(index, boardSize) === 'top-left' || 
    calcTileType(index, boardSize) === 'left' ||
    calcTileType(index, boardSize) === 'bottom-left') {
    yPositions.forEach((element) => positionsToAttack.push(...getAttackRange(stepCount, element, boardSize, 'right')));
  } else {
    yPositions.forEach((element) => positionsToAttack.push(...getAttackRange(stepCount, element, boardSize, 'right')));
    yPositions.forEach((element) => positionsToAttack.push(...getAttackRange(stepCount, element, boardSize, 'left')));
  }
  positionsToAttack.push(...yPositions);
  
  return positionsToAttack.filter((element) => element != index);
}

export function createCharacter(level, type) {
  if (type === 'bowman') {
    return new Bowman(level, 'bowman');
  }
  if (type === 'swordsman') {
    return new Swordsman(level, 'swordsman');
  }
  if (type === 'magician') {
    return new Magician(level, 'magician');
  }
  if (type === 'undead') {
    return new Undead(level, 'undead');
  }
  if (type === 'vampire') {
    return new Vampire(level, 'vampire');
  }
  if (type === 'daemon') {
    return new Daemon(level, 'daemon');
  }
}
