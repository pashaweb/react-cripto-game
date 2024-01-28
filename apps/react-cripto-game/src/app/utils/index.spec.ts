import { convertToCrypto } from './index';

describe('convertToCrypto', () => {
    it('should return correct value when fee is 0', () => {
        const result = convertToCrypto(100, 10, 0);
        expect(result).toBe(10);
    });

    it('should return correct value when fee is not 0', () => {
        const result = convertToCrypto(100, 10, 0.1);
        expect(result).toBeCloseTo(9.09, 2);
    });

    it('should return Infinity when rate is 0', () => {
        const result = convertToCrypto(100, 0, 0.1);
        expect(result).toBe(Infinity);
    });

    it('should return 0 when value is 0', () => {
        const result = convertToCrypto(0, 10, 0.1);
        expect(result).toBe(0);
    });
    


});