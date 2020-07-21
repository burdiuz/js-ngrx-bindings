import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { parsePropertyPath } from '../select.utils';
import { SelectBaseComponent } from './select-base-component';

@Component({
  selector: 'rx-select-once',
  template: '{{output}}',
})
export class SelectOnceComponent extends SelectBaseComponent {
  @Input()
  value: string;

  constructor(store: Store<any>) {
    super(store);
  }

  protected setSelector() {
    this.selectorFn = parsePropertyPath(this.value);
  }

  protected configureObservable(source: Observable): Observable {
    return source.pipe(take(1));
  }
}
