import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SelectBaseComponent } from './select-base-component';
export declare class SelectorOnceComponent extends SelectBaseComponent {
    private selectors;
    value: string;
    constructor(store: Store<any>, selectors: any);
    protected setSelector(): void;
    protected configureObservable(source: Observable<any>): Observable<any>;
}
export declare const createSelectorOnceComponent: (componentSelector: string, selectorFn: (store: any) => any, template?: string) => any;
export declare const createSelectorOnceComponents: (selectors: {
    [key: string]: (store: any) => any;
}, template?: string) => any[];
