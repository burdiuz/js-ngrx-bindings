import { PipeTransform, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { SubscriptionBase } from '../subscription-base';
export declare class SelectorPipe extends SubscriptionBase implements PipeTransform {
    private selectors;
    private changeDetector;
    private selectorKey;
    private selector;
    constructor(store: Store<any>, selectors: any, changeDetector: ChangeDetectorRef);
    transform(selectorKey: string, ...args: any[]): string;
    protected getSelector(): () => any;
    protected setCurrentValue(value: any): void;
    protected subscribe(): void;
}
