import { ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SelectBaseDirective } from './select-base-directive';
export declare class SelectorDirective extends SelectBaseDirective {
    private selectors;
    value: string;
    constructor(store: Store<any>, selectors: any, element: ElementRef);
    protected setSelector(): void;
    protected configureObservable(source: Observable<any>): Observable<any>;
}
export declare const createSelectorDirective: (directiveSelector: string, selectorFn: (store: any) => any, targetElement?: string, targetProp?: string, targetAttr?: string) => any;
export declare const createSelectorDirectives: (selectors: {
    [key: string]: (store: any) => any;
}, targetElement?: string, targetProp?: string, targetAttr?: string) => any[];
