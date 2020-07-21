import { NgModule } from '@angular/core';

import { SelectPipe } from './pipes/select.pipe';
import { SelectorPipe } from './pipes/selector.pipe';
import { SelectDirective } from './directives/select.directive';
import { SelectOnceDirective } from './directives/select-once.directive';
import { SelectorDirective } from './directives/selector.directive';
import { SelectorOnceDirective } from './directives/selector-once.directive';
import { SelectComponent } from './components/select.component';
import { SelectOnceComponent } from './components/select-once.component';
import { SelectorComponent } from './components/selector.component';
import { SelectorOnceComponent } from './components/selector-once.component';

@NgModule({
  declarations: [
    SelectPipe,
    SelectorPipe,

    SelectComponent,
    SelectOnceComponent,
    SelectorComponent,
    SelectorOnceComponent,

    SelectDirective,
    SelectOnceDirective,
    SelectorDirective,
    SelectorOnceDirective,
  ],
  imports: [],
  providers: [],
})
export class NGRXBindingsModule {}
