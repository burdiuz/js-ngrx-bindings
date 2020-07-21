import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { parsePropertyPath } from '../select.utils';
import { SelectBaseComponent } from './select-base-component';

@Component({
  selector: 'rx-select',
  template: '{{output}}',
})
export class SelectComponent extends SelectBaseComponent {
  @Input()
  value: string;

  constructor(store: Store<any>) {
    super(store);
  }

  protected setSelector() {
    this.selectorFn = parsePropertyPath(this.value);
  }

  protected configureObservable(source: Observable<any>): Observable<any> {
    return source;
  }
}
