import {
  Pipe,
  PipeTransform,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { parsePropertyPath } from '../select.utils';
import { SubscriptionBase } from '../subscription-base';

@Pipe({
  name: 'select',
  pure: false,
})
export class SelectPipe extends SubscriptionBase
  implements OnDestroy, PipeTransform {
  private path: string;
  private selector: (store: any) => any;

  constructor(store: Store<any>, private changeDetector: ChangeDetectorRef) {
    super(store);
  }

  transform(path: string): any {
    if (path !== this.path) {
      this.unsubscribe();

      this.path = path;
      const pathFn = parsePropertyPath(path);
      this.selector = (store) => pathFn(store, store);
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
    if (!this.path) {
      return;
    }

    super.subscribe();
  }
}
