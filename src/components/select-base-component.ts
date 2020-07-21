import { OnInit, OnChanges, SimpleChanges } from '@angular/core';

import { SubscriptionBase } from '../subscription-base';
import { Observable } from 'rxjs';

export abstract class SelectBaseComponent extends SubscriptionBase
  implements OnInit, OnChanges {
  protected selectorFn: (store: any) => any;

  output: any;

  protected abstract configureObservable(source: Observable<any>): Observable<any>;

  protected abstract setSelector(): void;

  protected getSelector() {
    return this.selectorFn;
  }

  protected getObservable() {
    return this.configureObservable(super.getObservable());
  }

  protected setCurrentValue(value: any) {
    super.setCurrentValue(value);
    this.applyValue();
  }

  private applyValue() {
    this.output = this.getCurrentValue();
  }

  ngOnInit() {
    this.setSelector();
    this.subscribe();
  }

  ngOnChanges({ value }: SimpleChanges) {
    if (value.isFirstChange) {
      return;
    }

    if (value.previousValue !== value.currentValue) {
      this.setSelector();
      this.subscribe();
    }

    this.applyValue();
  }
}
