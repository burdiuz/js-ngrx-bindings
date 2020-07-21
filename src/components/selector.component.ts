import { Component, Inject, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { SELECTORS_MAP_PROVIDER } from '../selectors.module';
import { Observable } from 'rxjs';

import { getSelectorFrom } from '../selector.utils';
import { SelectBaseComponent } from './select-base-component';

@Component({
  selector: 'rx-selector',
  template: '{{output}}',
})
export class SelectorComponent extends SelectBaseComponent {
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
    return source;
  }
}

export const createSelectorComponent = (
  componentSelector: string,
  selectorFn: (store: any) => any,
  template = '{{output}}'
) => {
  const Definition: any = Component({
    selector: componentSelector,
    template,
  })(
    class extends SelectBaseComponent {
      constructor(store: Store<any>) {
        super(store);
        this.selectorFn = selectorFn;
      }

      protected setSelector() {}

      protected configureObservable(source: Observable<any>): Observable<any> {
        return source;
      }

      ngOnChanges() {}
    }
  );

  Inject(Store)(Definition, undefined, 0);

  return Definition;
};

export const createSelectorComponents = (
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

    return [...list, createSelectorComponent(name, selectorFn, template)];
  }, []);
