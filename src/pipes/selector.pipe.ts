import { Pipe, PipeTransform, Inject } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { SELECTORS_MAP_PROVIDER } from '../selectors.module';

@Pipe({
  name: 'selector',
  pure: false,
})
export class SelectorPipe implements PipeTransform {
  constructor(
    private store: Store<any>,
    @Inject(SELECTORS_MAP_PROVIDER) private selectors: any
  ) {}

  transform(selectorKey: string, ...args: any[]): string {
    const { [selectorKey]: selector } = this.selectors;
    if (!selector) {
      return null;
    }

    return this.store.pipe(select(selector(args)));
  }
}
