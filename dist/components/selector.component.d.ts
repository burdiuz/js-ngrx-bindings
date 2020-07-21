import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SelectBaseComponent } from './select-base-component';
export declare class SelectorComponent extends SelectBaseComponent {
    private selectors;
    value: string;
    constructor(store: Store<any>, selectors: any);
    protected setSelector(): void;
    protected configureObservable(source: Observable<any>): Observable<any>;
}
export declare const createSelectorComponent: (componentSelector: string, selectorFn: (store: any) => any, template?: string) => any;
export declare const createSelectorComponents: (selectors: {
    [key: string]: (store: any) => any;
}, template?: string) => any[];
