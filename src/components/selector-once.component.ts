import { Component, Inject, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { SELECTORS_MAP_PROVIDER } from '../selectors.module';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { getSelectorFrom } from '../selector.utils';
import { SelectBaseComponent } from './select-base-component';

@Component({
  selector: 'rx-selector-once',
  template: '{{output}}',
})
export class SelectorOnceComponent extends SelectBaseComponent {
  @Input()
  value: string;

  constructor(
    store: Store<any>,
    @Inject(SELECTORS_MAP_PROVIDER) private selectors: any
  ) {
    super(store);
  }

  protected setSelector() {
    this.selectorFn = getSelectorFrom(this.value, this.selectors);
  }

  protected configureObservable(source: Observable<any>): Observable<any> {
    return source.pipe(take(1));
  }
}

export const createSelectorOnceComponent = (
  componentSelector: string,
  selectorFn: (store: any) => any,
  template = '{{output}}'
) => {
  const Definition: any = Component({
    selector: componentSelector,
    template,
  })(
    class CustomSelectorOnceComponent extends SelectBaseComponent {
      constructor(store: Store<any>) {
        super(store);
        this.selectorFn = selectorFn;
      }

      protected setSelector() {}

      protected configureObservable(source: Observable<any>): Observable<any> {
        return source.pipe(take(1));
      }

      ngOnChanges() {}
    }
  );

  Inject(Store)(Definition, undefined, 0);

  return Definition;
};

export const createSelectorOnceComponents = (
  selectors: {
    [key: string]: (store: any) => any;
  },
  template = '{{output}}'
) =>
  Object.keys(selectors).reduce((list, name) => {
    const selectorFn = selectors[name];

    if (typeof selectorFn !== 'function') {
      return list;
    }

    return [...list, createSelectorOnceComponent(name, selectorFn, template)];
  }, []);
