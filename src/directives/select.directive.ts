import { Directive, ElementRef, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';

import { parsePropertyPath } from '../select.utils';
import { SelectBaseDirective } from './select-base-directive';

@Directive({
  selector: '[select]',
})
export class SelectDirective extends SelectBaseDirective {
  @Input('select')
  value: string;

  constructor(store: Store<any>, element: ElementRef) {
    super(store, element);
  }

  protected setSelector() {
    this.selectorFn = parsePropertyPath(this.value);
  }

  protected configureObservable(source: Observable): Observable {
    return source;
  }
}
