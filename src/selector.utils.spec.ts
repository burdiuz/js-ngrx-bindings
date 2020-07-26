import { getSelectorFrom } from './selector.utils';

describe('Selector Utils', () => {
  describe('getSelectorFrom()', () => {
    describe('When used with string', () => {
      it('should use string as a key in storage', () => {
        const fn = () => null;

        expect(getSelectorFrom('key', { key: fn })).toBe(fn);
      });
    });

    describe('When used with function', () => {
      it('should return function as is', () => {
        const fn = () => null;

        expect(getSelectorFrom(fn, {})).toBe(fn);
      });
    });
  });
});
