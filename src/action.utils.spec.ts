import { createActionFrom } from './action.utils';

describe('Action Utils', () => {
  describe('createActionFrom()', () => {
    describe('When string used as an action', () => {
      it('should generate action object', () => {
        expect(createActionFrom('My Test Action', 'Payload')).toEqual({
          type: 'My Test Action',
          payload: 'Payload',
        });
      });
    });

    describe('When object used as an action', () => {
      it('should generate action object', () => {
        expect(
          createActionFrom(
            { type: 'My Test Action', meta: 'anything' } as any,
            'Payload'
          )
        ).toEqual(
          jasmine.objectContaining({
            type: 'My Test Action',
            payload: 'Payload',
            meta: 'anything',
          })
        );
      });
    });

    describe('When function used as an action creator', () => {
      it('should generate action object', () => {
        expect(
          createActionFrom(
            (payload) => ({ type: 'My Test Action', payload }),
            'Payload'
          )
        ).toEqual({
          type: 'My Test Action',
          payload: 'Payload',
        });
      });
    });
  });
});
