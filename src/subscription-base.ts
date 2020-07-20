import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';

export abstract class SubscriptionBase implements OnDestroy {
  protected subscription: Subscription;
  private currentValue: any;

  constructor(protected store: Store<any>) {}

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  protected abstract getSelector(): (...args: any[]) => any;

  protected getCurrentValue(): any {
    return this.currentValue;
  }

  protected setCurrentValue(value: any): void {
    this.currentValue = value;
  }

  protected getObservable() {
    return this.store.pipe(select(this.getSelector()));
  }

  protected subscribe() {
    this.unsubscribe();

    this.subscription = this.getObservable().subscribe((value: any) => {
      if (this.getCurrentValue() === value) {
        return;
      }

      this.setCurrentValue(value);
    });
  }

  protected unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = null;
  }
}
