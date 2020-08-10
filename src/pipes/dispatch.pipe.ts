import { Pipe, PipeTransform, Inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { createActionFrom, NGRXAction } from '../action.utils';
import { ACTIONS_MAP_PROVIDER } from '../actions.module';

@Pipe({
  name: 'dispatch',
})
export class DispatchPipe implements PipeTransform {
  constructor(
    private store: Store<any>,
    @Inject(ACTIONS_MAP_PROVIDER) private actions: any
  ) {}

  transform(payload: any, actionSource?: NGRXAction): any {
    let action = actionSource;

    if(typeof action === 'string') {
      action = this.actions[action];
    }

    this.store.dispatch(createActionFrom(action, payload));
    return payload;
  }
}
