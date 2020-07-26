import {
  Component,
  Inject,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output,
} from '@angular/core';
import { Store, select } from '@ngrx/store';

import { HubBaseComponent } from './hub-base-component';

export const createEventHubComponent = (
  componentSelector: string,
  selectors: { [key: string]: (store: any) => any },
  template = ''
) => {
  const Definition: any = Component({
    selector: componentSelector,
    template,
  })(
    class CustomEventHubComponent extends HubBaseComponent
      implements OnInit, OnDestroy {
      constructor(private store: Store<any>) {
        super();
      }

      ngOnInit() {
        this.subscriptions = Object.keys(selectors).map((key) => {
          const subj = this.store.pipe(select(selectors[key]));
          const emitter = new EventEmitter();

          this[key] = emitter;
          this[`${key}$`] = subj;

          return subj.subscribe((value) => emitter.emit(value));
        });
      }
    }
  );

  Inject(Store)(Definition, undefined, 0);

  Object.keys(selectors).forEach((key) => {
    Output()(Definition, key, undefined);
  });

  return Definition;
};
