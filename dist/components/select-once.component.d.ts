import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SelectBaseComponent } from './select-base-component';
export declare class SelectOnceComponent extends SelectBaseComponent {
    value: string;
    constructor(store: Store<any>);
    protected setSelector(): void;
    protected configureObservable(source: Observable<any>): Observable<any>;
}
