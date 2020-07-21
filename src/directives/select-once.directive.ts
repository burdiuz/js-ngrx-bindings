import { Directive, ElementRef, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { parsePropertyPath } from '../select.utils';
import { SelectBaseDirective } from './select-base-directive';

@Directive({
  selector: '[selectOnce]',
})
export class SelectOnceDirective extends SelectBaseDirective {
  @Input('selectOnce')
  value: string;

  constructor(store: Store<any>, element: ElementRef) {
    super(store, element);
  }

  protected setSelector() {
    this.selectorFn = parsePropertyPath(this.value);
  }

  protected configureObservable(source: Observable<any>): Observable<any> {
    return source.pipe(take(1));
  }
}
