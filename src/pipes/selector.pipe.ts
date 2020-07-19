import { Pipe, PipeTransform, Inject, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';

import { SELECTORS_MAP_PROVIDER } from '../selectors.module';
import { SubscriptionBase } from '../subscription-base';

@Pipe({
  name: 'selector',
  pure: false,
})
export class SelectorPipe extends SubscriptionBase implements PipeTransform {
  private selectorKey: string;
  private selector: () => any;

  constructor(
    store: Store<any>,
    @Inject(SELECTORS_MAP_PROVIDER) private selectors: any,
    private changeDetector: ChangeDetectorRef
  ) {
    super(store);
  }

  transform(selectorKey: string, ...args: any[]): string {
    if (selectorKey !== this.selectorKey) {
      this.unsubscribe();
      this.selectorKey = selectorKey;
      this.subscribe();
    }

    return this.getCurrentValue();
  }

  protected getSelector() {
    return this.selector;
  }

  protected setCurrentValue(value: any) {
    super.setCurrentValue(value);
    this.changeDetector.markForCheck();
  }

  protected subscribe() {
    if (!this.selectorKey) {
      return;
    }

    const { [this.selectorKey]: selector } = this.selectors;

    this.selector = selector;
    super.subscribe();
  }
}
