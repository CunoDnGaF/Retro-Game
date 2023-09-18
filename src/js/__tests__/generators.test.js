import {characterGenerator, generateTeam, getPositionsToMove, getPositionsToAttack} from '../generators';


test('should return "Bowman" of the 1 level', () => {
    let allowedTypes = ['bowman'];
    let character = characterGenerator(allowedTypes, 1).next().value;
    
      expect(character.level).toBe(1);
      expect(character.attack).toBe(25);
      expect(character.defence).toBe(25);
      expect(character.health).toBe(50);
      expect(character.type).toBe('bowman');
});

test('should return "Swordsman" of the 1 level', () => {
    let allowedTypes = ['swordsman'];
    let character = characterGenerator(allowedTypes, 1).next().value;
    
      expect(character.level).toBe(1);
      expect(character.attack).toBe(40);
      expect(character.defence).toBe(10);
      expect(character.health).toBe(50);
      expect(character.type).toBe('swordsman');
});

test('should return "Magician" of the 1 level', () => {
    let allowedTypes = ['magician'];
    let character = characterGenerator(allowedTypes, 1).next().value;
    
      expect(character.level).toBe(1);
      expect(character.attack).toBe(10);
      expect(character.defence).toBe(40);
      expect(character.health).toBe(50);
      expect(character.type).toBe('magician');
});

test('should return "Undead" of the 1 level', () => {
    let allowedTypes = ['undead'];
    let character = characterGenerator(allowedTypes, 1).next().value;
    
      expect(character.level).toBe(1);
      expect(character.attack).toBe(40);
      expect(character.defence).toBe(10);
      expect(character.health).toBe(50);
      expect(character.type).toBe('undead');
});

test('should return "Daemon" of the 1 level', () => {
    let allowedTypes = ['daemon'];
    let character = characterGenerator(allowedTypes, 1).next().value;
    
      expect(character.level).toBe(1);
      expect(character.attack).toBe(10);
      expect(character.defence).toBe(10);
      expect(character.health).toBe(50);
      expect(character.type).toBe('daemon');
});

test('should return "Vampire" of the 1 level', () => {
    let allowedTypes = ['vampire'];
    let character = characterGenerator(allowedTypes, 1).next().value;
    
      expect(character.level).toBe(1);
      expect(character.attack).toBe(25);
      expect(character.defence).toBe(25);
      expect(character.health).toBe(50);
      expect(character.type).toBe('vampire');
});

test('should return many different characters', () => {
    let allowedTypes = ['bowman', 'vampire', 'daemon', 'magician'];
    let character1 = characterGenerator(allowedTypes, 3).next().value;
    let character2 = characterGenerator(allowedTypes, 3).next().value;
    let character3 = characterGenerator(allowedTypes, 3).next().value;
    
      expect(character1 === character2 === character3).toBe(false);
});

test('should return a team with a level below 3', () => {
    let allowedTypes = ['bowman', 'vampire', 'daemon', 'magician'];
    let team = generateTeam(allowedTypes, 3, 16);
    let levels = [];
    
    for (let i = 0; i < team.characters.length; i++) {
        levels.push(team.characters[i].level);
    }

    expect(Math.max(...levels)).toBe(3);
});

test('should return the correct positions for movement', () => {
  let allowedPositions = [1, 8, 9];
  let positionsToMove = getPositionsToMove(0, 'swordsman', 8);

  expect(positionsToMove).toEqual(allowedPositions);
});

test('should return the correct positions for movement', () => {
  let allowedPositions = [6, 5, 15, 23, 14, 21];
  let positionsToMove = getPositionsToMove(7, 'bowman', 8);

  expect(positionsToMove).toEqual(allowedPositions);
});

test('should return the correct positions for movement', () => {
  let allowedPositions = [55, 47, 39, 31, 54, 45, 36, 27, 62, 61, 60, 59];
  let positionsToMove = getPositionsToMove(63, 'magician', 8);

  expect(positionsToMove).toEqual(allowedPositions);
});

test('should return the correct positions for movement', () => {
  let allowedPositions = [48, 40, 49, 42, 57, 58];
  let positionsToMove = getPositionsToMove(56, 'bowman', 8);

  expect(positionsToMove).toEqual(allowedPositions);
});

test('should return the correct positions for movement', () => {
  let allowedPositions = [30, 31, 29, 37, 39, 46, 45, 47];
  let positionsToMove = getPositionsToMove(38, 'swordsman', 8);

  expect(positionsToMove).toEqual(allowedPositions);
});

test('should return the correct positions for attack', () => {
  let allowedPositions = [34, 35, 26, 27, 50, 51, 58, 59, 42, 43, 32, 24, 48, 56, 40, 33, 25, 49, 57];
  let positionsToAttack = getPositionsToAttack(41, 'bowman', 8);

  expect(positionsToAttack).toEqual(allowedPositions);
});

test('should return the correct positions for attack', () => {
  let allowedPositions = [9, 10, 17, 18, 1,  2,  8, 16];
  let positionsToAttack = getPositionsToAttack(0, 'bowman', 8);

  expect(positionsToAttack).toEqual(allowedPositions);
});

test('should return the correct positions for attack', () => {
  let allowedPositions = [14, 13, 12, 11, 22, 21, 20, 19, 30, 29, 28, 27, 38, 37, 36, 35, 6, 5, 4, 3, 15, 23, 31, 39];
  let positionsToAttack = getPositionsToAttack(7, 'magician', 8);

  expect(positionsToAttack).toEqual(allowedPositions);
});

test('should return the correct positions for attack', () => {
  let allowedPositions = [54, 62, 55];
  let positionsToAttack = getPositionsToAttack(63, 'swordsman', 8);

  expect(positionsToAttack).toEqual(allowedPositions);
});

test('should return the correct positions for attack', () => {
  let allowedPositions = [49, 50, 41, 42, 57, 58, 48, 40];
  let positionsToAttack = getPositionsToAttack(56, 'bowman', 8);

  expect(positionsToAttack).toEqual(allowedPositions);
});