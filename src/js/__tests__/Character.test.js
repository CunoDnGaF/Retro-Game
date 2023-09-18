import Character from '../Character';
import Bowman from '../characters/Bowman';

test('should return "Bowman" class', () => {
    let character = new Bowman(1);
    
    expect(character.level).toBe(1);
    expect(character.attack).toBe(25);
    expect(character.defence).toBe(25);
    expect(character.health).toBe(50);
    expect(character.type).toBe('bowman');
});

test('should throw the error "Нельзя создать класс "Character""', () => {
    expect(() => new Character(1, 'bowman')).toThrow('Нельзя создать класс "Character"');
});
