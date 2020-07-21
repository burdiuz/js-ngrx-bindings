import { ElementRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { SubscriptionBase } from '../subscription-base';
import { Observable } from 'rxjs';
export declare abstract class SelectNoInputDirective extends SubscriptionBase implements OnInit, OnChanges {
    protected element: ElementRef;
    targetElement: string;
    targetProp: string;
    targetAttr: string;
    protected selectorFn: (store: any) => any;
    constructor(store: Store<any>, element: ElementRef);
    protected abstract configureObservable(source: Observable<any>): Observable<any>;
    protected abstract setSelector(): void;
    protected getSelector(): (store: any) => any;
    protected getObservable(): Observable<any>;
    protected setCurrentValue(value: any): void;
    private applyValue;
    ngOnInit(): void;
    ngOnChanges({ value }: SimpleChanges): void;
}
export declare abstract class SelectBaseDirective extends SelectNoInputDirective {
    targetElement: string;
    targetProp: string;
    targetAttr: string;
}
