import { Directive, ElementRef, Inject, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { SELECTORS_MAP_PROVIDER } from '../selectors.module';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { getSelectorFrom } from '../selector.utils';
import {
  SelectBaseDirective,
  SelectNoInputDirective,
} from './select-base-directive';

@Directive({
  selector: '[selectorOnce]',
})
export class SelectorOnceDirective extends SelectBaseDirective {
  @Input('selectorOnce')
  value: string;

  constructor(
    store: Store<any>,
    @Inject(SELECTORS_MAP_PROVIDER) private selectors: any,
    element: ElementRef
  ) {
    super(store, element);
  }

  protected setSelector() {
    this.selectorFn = getSelectorFrom(this.value, this.selectors);
  }

  protected configureObservable(source: Observable<any>): Observable<any> {
    return source.pipe(take(1));
  }
}

export const createSelectorOnceDirective = (
  directiveSelector: string,
  selectorFn: (store: any) => any,
  targetElement = '',
  targetProp = 'innerText',
  targetAttr = ''
) => {
  const Definition: any = Directive({
    selector: directiveSelector,
  })(
    class CustomSelectorOnceDirective extends SelectNoInputDirective {
      constructor(store: Store<any>, el: ElementRef) {
        super(store, el);
        this.selectorFn = selectorFn;
        this.targetElement = targetElement;
        this.targetProp = targetProp;
        this.targetAttr = targetAttr;
      }

      protected setSelector() {}

      protected configureObservable(source: Observable<any>): Observable<any> {
        return source.pipe(take(1));
      }

      ngOnChanges() {}
    }
  );

  Inject(Store)(Definition, undefined, 0);
  Inject(ElementRef)(Definition, undefined, 1);

  return Definition;
};

export const createSelectorOnceDirectives = (
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
      createSelectorOnceDirective(
        `[${name}]`,
        selectorFn,
        targetElement,
        targetProp,
        targetAttr
      ),
    ];
  }, []);
