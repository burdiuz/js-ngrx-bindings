import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { HubBaseComponent } from './hub-base-component';

export const createDataHubComponent = (
  componentSelector: string,
  selectors: { [key: string]: (store: any) => any },
  template = ''
) => {
  const Definition: any = Component({
    selector: componentSelector,
    template,
  })(
    class CustomDataHubComponent extends HubBaseComponent implements OnInit, OnDestroy {
      constructor(private store: Store<any>) {
        super();
      }

      ngOnInit() {
        this.subscriptions = Object.keys(selectors).map((key) => {
          const subj = this.store.pipe(select(selectors[key]));

          this[`${key}$`] = subj;

          return subj.subscribe((value) => {
            this[key] = value;
          });
        });
      }
    }
  );

  Inject(Store)(Definition, undefined, 0);

  return Definition;
};
