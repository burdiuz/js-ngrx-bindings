import { OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { SubscriptionBase } from '../subscription-base';
import { Observable } from 'rxjs';
export declare abstract class SelectBaseComponent extends SubscriptionBase implements OnInit, OnChanges {
    protected selectorFn: (store: any) => any;
    output: any;
    protected abstract configureObservable(source: Observable<any>): Observable<any>;
    protected abstract setSelector(): void;
    protected getSelector(): (store: any) => any;
    protected getObservable(): Observable<any>;
    protected setCurrentValue(value: any): void;
    private applyValue;
    ngOnInit(): void;
    ngOnChanges({ value }: SimpleChanges): void;
}
