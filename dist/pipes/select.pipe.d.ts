import { PipeTransform, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { SubscriptionBase } from '../subscription-base';
export declare class SelectPipe extends SubscriptionBase implements OnDestroy, PipeTransform {
    private changeDetector;
    private path;
    private selector;
    constructor(store: Store<any>, changeDetector: ChangeDetectorRef);
    transform(path: string): any;
    protected getSelector(): (store: any) => any;
    protected setCurrentValue(value: any): void;
    protected subscribe(): void;
}
