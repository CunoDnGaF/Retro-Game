import {calcTileType} from '../utils.js';

test('should return "top-left"', () => {
    expect(calcTileType(0, 8)).toBe('top-left');
});
test('should return "top"', () => {
    expect(calcTileType(3, 10)).toBe('top');
});
test('should return "top-right"', () => {
    expect(calcTileType(13, 14)).toBe('top-right');
});
test('should return "right"', () => {
    expect(calcTileType(11, 6)).toBe('right');
});
test('should return "left"', () => {
    expect(calcTileType(16, 8)).toBe('left');
});
test('should return "bottom-left"', () => {
    expect(calcTileType(6, 3)).toBe('bottom-left');
});
test('should return "bottom-right"', () => {
    expect(calcTileType(15, 4)).toBe('bottom-right');
});
test('should return "bottom"', () => {
    expect(calcTileType(60, 8)).toBe('bottom');
});
test('should return "center"', () => {
    expect(calcTileType(12, 5)).toBe('center');
});