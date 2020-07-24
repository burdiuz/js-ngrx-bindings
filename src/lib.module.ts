import { NgModule } from '@angular/core';

import { ActionPipe } from './pipes/action.pipe';
import { DispatchPipe } from './pipes/dispatch.pipe';
import { SelectPipe } from './pipes/select.pipe';
import { SelectorPipe } from './pipes/selector.pipe';
import { SelectDirective } from './directives/select.directive';
import { SelectOnceDirective } from './directives/select-once.directive';
import { SelectorDirective } from './directives/selector.directive';
import { SelectorOnceDirective } from './directives/selector-once.directive';
import { ActionComponent } from './components/action.component';
import { ChannelComponent } from './components/channel.component';
import { SelectComponent } from './components/select.component';
import { SelectOnceComponent } from './components/select-once.component';
import { SelectorComponent } from './components/selector.component';
import { SelectorOnceComponent } from './components/selector-once.component';

const LIST = [
  ActionPipe,
  DispatchPipe,
  SelectPipe,
  SelectorPipe,

  ActionComponent,
  ChannelComponent,
  SelectComponent,
  SelectOnceComponent,
  SelectorComponent,
  SelectorOnceComponent,

  SelectDirective,
  SelectOnceDirective,
  SelectorDirective,
  SelectorOnceDirective,
];

@NgModule({
  declarations: LIST,
  imports: [],
  providers: [],
  exports: LIST,
})
export class NGRXBindingsModule {}
