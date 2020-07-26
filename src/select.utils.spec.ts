import { parsePropertyPath } from './select.utils';

describe('Select Utils', () => {
  describe('parsePropertyPath()', () => {
    let accessor: (store: any) => any;

    describe('When short path', () => {
      beforeEach(() => {
        accessor = parsePropertyPath('data');
      });

      it('should properly generate accessor', () => {
        expect(
          accessor({
            data: 4,
          })
        ).toBe(4);
      });
    });

    describe('When empty path', () => {
      beforeEach(() => {
        accessor = parsePropertyPath('');
      });

      it('should properly generate accessor', () => {
        expect(accessor(4)).toBe(4);
      });
    });

    describe('When long path', () => {
      beforeEach(() => {
        accessor = parsePropertyPath('data.props[2].value.number.integer.four');
      });

      it('should properly generate accessor', () => {
        expect(
          accessor({
            data: {
              props: [0, 1, { value: { number: { integer: { four: 4 } } } }],
            },
          })
        ).toBe(4);
      });
    });

    describe('When path with dynamic access', () => {
      beforeEach(() => {
        // Path cannot start from dynamic access, parser will think its an array.
        accessor = parsePropertyPath('data["props"][2]["value"]');
      });

      it('should properly generate accessor', () => {
        expect(
          accessor({
            data: {
              props: [0, 1, { value: 4 }],
            },
          })
        ).toBe(4);
      });
    });

    describe('When path with method call', () => {
      beforeEach(() => {
        accessor = parsePropertyPath('getData().prop.toString()');
      });

      it('should properly generate accessor', () => {
        expect(
          accessor({
            getData: () => ({
              prop: 4,
            }),
          })
        ).toBe('4');
      });
    });

    describe('When path with function call', () => {
      beforeEach(() => {
        accessor = parsePropertyPath(
          'data["getProps"]()[2].value["getNumber"]()'
        );
      });

      it('should properly generate accessor', () => {
        expect(
          accessor({
            data: {
              getProps: () => [0, 1, { value: { getNumber: () => 4 } }],
            },
          })
        ).toBe(4);
      });
    });
  });
});
