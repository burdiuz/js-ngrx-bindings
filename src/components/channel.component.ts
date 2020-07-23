import { Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { ACTIONS_MAP_PROVIDER } from '../actions.module';
import { createActionFrom } from '../action.utils';

/*
  Component receives an object of actions/action creators
  and generates methods for each to be able to call them
  from HTML.
*/

@Component({
  selector: 'rx-channel',
  template: '',
})
export class ChannelComponent {
  constructor(
    private store: Store<any>,
    @Inject(ACTIONS_MAP_PROVIDER) private actions: any
  ) {
    Object.keys(actions).forEach((key: string) => {
      this[key] = (payload?: any) => this.dispatch(key, payload);
    });
  }

  dispatch(action: string, payload?: any) {
    this.store.dispatch(createActionFrom(this.actions[action], payload));
  }
}
