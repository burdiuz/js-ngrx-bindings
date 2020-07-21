import { ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SelectBaseDirective } from './select-base-directive';
export declare class SelectDirective extends SelectBaseDirective {
    value: string;
    constructor(store: Store<any>, element: ElementRef);
    protected setSelector(): void;
    protected configureObservable(source: Observable<any>): Observable<any>;
}
