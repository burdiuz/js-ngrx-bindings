import { InjectionToken, ModuleWithProviders } from '@angular/core';
export declare const SELECTORS_MAP_PROVIDER: InjectionToken<unknown>;
declare class SelectorsMapModule {
}
export declare class SelectorsModule {
    static forSelectors(selectors: {
        [key: string]: (...args: any) => any;
    }): ModuleWithProviders<SelectorsMapModule>;
}
export {};
