import {
  ElementRef,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { SubscriptionBase } from '../subscription-base';
import { Observable } from 'rxjs';

export abstract class SelectNoInputDirective extends SubscriptionBase
  implements OnInit, OnChanges {
  targetElement: string;
  targetProp: string;
  targetAttr: string;
  protected selectorFn: (store: any) => any;

  constructor(store: Store<any>, protected element: ElementRef) {
    super(store);
  }

  protected abstract configureObservable(source: Observable<any>): Observable<any>;

  protected abstract setSelector(): void;

  protected getSelector() {
    return this.selectorFn;
  }

  protected getObservable() {
    return this.configureObservable(super.getObservable());
  }

  protected setCurrentValue(value: any) {
    super.setCurrentValue(value);
    this.applyValue();
  }

  private applyValue() {
    const value = this.getCurrentValue();

    let target: HTMLElement = this.element.nativeElement;

    if (this.targetElement) {
      target = target.querySelector(this.targetElement);
    }

    if (this.targetProp) {
      target[this.targetProp] = value;
    }

    if (this.targetAttr) {
      target.setAttribute(this.targetAttr, value);
    }
  }

  ngOnInit() {
    this.setSelector();
    this.subscribe();
  }

  ngOnChanges({ value }: SimpleChanges) {
    if (value.isFirstChange) {
      return;
    }

    if (value.previousValue !== value.currentValue) {
      this.setSelector();
      this.subscribe();
    }

    this.applyValue();
  }
}

export abstract class SelectBaseDirective extends SelectNoInputDirective {
  @Input()
  targetElement: string;
  @Input()
  targetProp: string = 'innerText';
  @Input()
  targetAttr: string;
}
