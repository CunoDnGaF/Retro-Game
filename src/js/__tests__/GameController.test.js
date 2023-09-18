import GameController from '../GameController';
import Bowman from '../characters/Bowman';
import PositionedCharacter from '../PositionedCharacter';

test('should return the Bowmans information', () => {
    const game = new GameController;
    const bowman = new PositionedCharacter(new Bowman(1), 1);
    
    expect(game.characterInfo(bowman)).toBe(`🎖${1} ⚔${25} 🛡${25} ❤${50}`);
});
