import { NgModule, InjectionToken, ModuleWithProviders } from '@angular/core';

export const SELECTORS_MAP_PROVIDER = new InjectionToken(
  'ngrx-selectors-provider'
);

@NgModule({})
export class SelectorsMapModule {}

export class SelectorsModule {
  static forSelectors(selectors: {
    [key: string]: (...args: any) => any;
  }): ModuleWithProviders<SelectorsMapModule> {
    return {
      ngModule: SelectorsMapModule,
      providers: [{ provide: SELECTORS_MAP_PROVIDER, useValue: selectors }],
    };
  }
}
