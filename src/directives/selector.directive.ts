import { Directive, ElementRef, Inject, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { SELECTORS_MAP_PROVIDER } from '../selectors.module';
import { Observable } from 'rxjs';

import {
  SelectBaseDirective,
  SelectNoInputDirective,
} from './select-base-directive';

@Directive({
  selector: '[selector]',
})
export class SelectorDirective extends SelectBaseDirective {
  @Input('selector')
  value: string;

  constructor(
    store: Store<any>,
    @Inject(SELECTORS_MAP_PROVIDER) private selectors: any,
    element: ElementRef
  ) {
    super(store, element);
  }

  protected setSelector() {
    this.selectorFn = this.selectors[this.value];
  }

  protected configureObservable(source: Observable): Observable {
    return source;
  }
}

export const createSelectorDirective = (
  directiveSelector: string,
  selectorFn: (store: any) => any,
  targetElement = '',
  targetProp = 'innerText',
  targetAttr = ''
) =>
  Directive({
    selector: directiveSelector,
  })(
    class extends SelectNoInputDirective {
      static ctorParameters = () => [{ type: Store }, { type: ElementRef }];

      constructor(store: Store<any>, el: ElementRef) {
        super(store, el);
        this.selectorFn = selectorFn;
        this.targetElement = targetElement;
        this.targetProp = targetProp;
        this.targetAttr = targetAttr;
      }

      protected setSelector() {}

      protected configureObservable(source: Observable): Observable {
        return source;
      }
    }
  );

export const createSelectorDirectives = (
  selectors: { [key: string]: (store: any) => any },
  targetElement = '',
  targetProp = 'innerText',
  targetAttr = ''
) =>
  Object.keys(selectors).reduce((list, name) => {
    const selectorFn = selectors[name];

    if (typeof selectorFn !== 'function') {
      return list;
    }

    return [
      ...list,
      createSelectorDirective(
        `[${name}]`,
        selectorFn,
        targetElement,
        targetProp,
        targetAttr
      ),
    ];
  }, []);
