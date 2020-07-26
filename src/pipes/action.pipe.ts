import { Pipe, PipeTransform, Inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { createActionFrom, NGRXAction } from '../action.utils';

@Pipe({
  name: 'action',
})
export class ActionPipe implements PipeTransform {
  constructor(private store: Store<any>) {}

  transform(payload: any, action?: NGRXAction): any {
    this.store.dispatch(createActionFrom(action, payload));

    return payload;
  }
}

export const createActionPipe = (pipeName: string, action: NGRXAction) => {
  const Definition: any = Pipe({
    name: pipeName,
  })(
    class CustomActionPipe {
      constructor(private store: Store<any>) {}

      transform(payload: any): any {
        this.store.dispatch(createActionFrom(action, payload));

        return payload;
      }
    }
  );

  Inject(Store)(Definition, undefined, 0);

  return Definition;
};

export const createActionPipes = (actions: {
  [pipeName: string]: NGRXAction;
}) =>
  Object.keys(actions).reduce((list, name) => {
    const action = actions[name];

    return [...list, createActionPipe(name, action)];
  }, []);
