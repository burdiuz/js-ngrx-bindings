import { NgModule, InjectionToken, ModuleWithProviders } from '@angular/core';
import { Action } from '@ngrx/store';

import { NGRXAction } from './action.utils';

export const ACTIONS_MAP_PROVIDER = new InjectionToken(
  'ngrx-bindings-actions-provider'
);

@NgModule({})
export class ActionsMapModule {}

export class ActionsModule {
  static forActions(actions: {
    [key: string]: NGRXAction;
  }): ModuleWithProviders<ActionsMapModule> {
    return {
      ngModule: ActionsMapModule,
      providers: [{ provide: ACTIONS_MAP_PROVIDER, useValue: actions }],
    };
  }
}
