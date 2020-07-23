import { Pipe, PipeTransform, Inject } from '@angular/core';
import { Store, Action, ActionCreator } from '@ngrx/store';

import { createActionFrom } from '../action.utils';
import { ACTIONS_MAP_PROVIDER } from '../actions.module';

@Pipe({
  name: 'dispatch',
})
export class DispatchPipe implements PipeTransform {
  constructor(
    private store: Store<any>,
    @Inject(ACTIONS_MAP_PROVIDER) private actions: any
  ) {}

  transform(payload: any, action?: string | Action | ActionCreator): any {
    return this.store.dispatch(createActionFrom(action, payload));
  }
}
