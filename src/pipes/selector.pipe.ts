import { Pipe, PipeTransform, Inject, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';

import { getSelectorFrom } from '../selector.utils';
import { SELECTORS_MAP_PROVIDER } from '../selectors.module';
import { SubscriptionBase } from '../subscription-base';

@Pipe({
  name: 'selector',
  pure: false,
})
export class SelectorPipe extends SubscriptionBase implements PipeTransform {
  private selectorKey: any;
  private selector: () => any;

  constructor(
    store: Store<any>,
    @Inject(SELECTORS_MAP_PROVIDER) private selectors: any,
    private changeDetector: ChangeDetectorRef
  ) {
    super(store);
  }

  transform(selectorKey: string): string {
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

    this.selector = getSelectorFrom(this.selectorKey, this.selectors);
    super.subscribe();
  }
}
