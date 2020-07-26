import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

export class HubBaseComponent implements OnDestroy {
  protected subscriptions: Subscription[];

  constructor() {}

  ngOnDestroy() {
    if (!this.subscriptions) {
      return;
    }

    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });

    this.subscriptions = null;
  }
}
