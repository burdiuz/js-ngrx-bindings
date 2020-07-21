import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
export declare abstract class SubscriptionBase implements OnDestroy {
    protected store: Store<any>;
    protected subscription: Subscription;
    private currentValue;
    constructor(store: Store<any>);
    ngOnDestroy(): void;
    protected abstract getSelector(): (...args: any[]) => any;
    protected getCurrentValue(): any;
    protected setCurrentValue(value: any): void;
    protected getObservable(): import("rxjs").Observable<any>;
    protected subscribe(): void;
    protected unsubscribe(): void;
}
