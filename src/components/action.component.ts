import { Component, Input, Inject } from '@angular/core';
import { Store, Action, ActionCreator } from '@ngrx/store';

import { createActionFrom } from '../action.utils';

@Component({
  selector: 'rx-action',
  template: '',
})
export class ActionComponent {
  @Input()
  type: string;

  constructor(private store: Store<any>) {}

  dispatch(payload: any) {
    this.store.dispatch(createActionFrom(this.type, payload));
  }
}

export const createActionComponent = (
  componentSelector: string,
  action: string | Action | ActionCreator,
  template = ''
) => {
  const Definition: any = Component({
    selector: componentSelector,
    template,
  })(
    class {
      constructor(private store: Store<any>) {}

      dispatch(payload: any) {
        this.store.dispatch(createActionFrom(action, payload));
      }
    }
  );

  Inject(Store)(Definition, undefined, 0);

  return Definition;
};

export const createActionComponents = (
  actions: {
    [key: string]: string | Action | ActionCreator;
  },
  template = ''
) =>
  Object.keys(actions).reduce(
    (list, name) => [
      ...list,
      createActionComponent(name, actions[name], template),
    ],
    []
  );
