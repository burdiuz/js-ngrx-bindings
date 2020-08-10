import { Component, Input, Inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { createActionFrom, NGRXAction } from '../action.utils';

@Component({
  selector: 'rx-action',
  template: '',
})
export class ActionComponent {
  @Input()
  type: NGRXAction;

  constructor(private store: Store<any>) {}

  dispatch(payload: any) {
    this.store.dispatch(createActionFrom(this.type, payload));
  }
}

export const createActionComponent = (
  componentSelector: string,
  action: NGRXAction,
  template = ''
) => {
  const Definition: any = Component({
    selector: componentSelector,
    template,
  })(
    class CustomActionComponent {
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
    [key: string]: NGRXAction;
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
