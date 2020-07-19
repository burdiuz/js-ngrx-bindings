import {
  Pipe,
  PipeTransform,
  ChangeDetectorRef,
  OnDestroy,
  Compiler,
} from '@angular/core';
import { Parser, Lexer, IvyParser } from '@angular/compiler';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { constructPathFrom } from '../select.utils';

@Pipe({
  name: 'select',
  pure: false,
})
export class SelectPipe implements OnDestroy, PipeTransform {
  private path: string;
  private selector: (store: any) => any;
  private subscription: Subscription;
  private currentValue: any;

  private parser: Parser;

  constructor(
    private store: Store<any>,
    private changeDetector: ChangeDetectorRef,
    private compiler: Compiler
  ) {
    this.parser = new IvyParser(new Lexer());
  }

  transform(path: string): any {
    if (path !== this.path) {
      this.unsubscribe();

      this.path = path;
      const { ast } = this.parser.parseBinding(this.path, null, 0);

      const pathFn = constructPathFrom(ast);
      this.selector = (store) => pathFn(store, store);
      this.subscribe();
    }

    return this.currentValue;
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  private subscribe() {
    if (!this.path) {
      return;
    }

    this.currentValue = this.store.select(this.path);

    this.store.pipe(select(this.selector)).subscribe((value: any) => {
      if (this.currentValue === value) {
        return;
      }

      console.log('VALUE:', this.path, value);
      this.currentValue = value;
      this.changeDetector.markForCheck();
    });
  }

  private unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.currentValue = undefined;
    this.subscription = null;
  }
}
