import { Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { ACTIONS_MAP_PROVIDER } from '../actions.module';
import { createActionFrom, NGRXAction } from '../action.utils';

const generateActionMethods = (
  actions,
  target: {
    dispatch: (key: string, payload?: any) => any;
  }
) => {
  Object.keys(actions).forEach((key: string) => {
    target[key] = (payload?: any) => target.dispatch(key, payload);
  });
};

@Component({
  selector: 'rx-channel',
  template: '',
})
export class ChannelComponent {
  constructor(
    private store: Store<any>,
    @Inject(ACTIONS_MAP_PROVIDER) private actions: any
  ) {
    generateActionMethods(actions, this);
  }

  dispatch(action: string, payload?: any) {
    this.store.dispatch(createActionFrom(this.actions[action], payload));

    return this;
  }
}

export const createChannelComponent = (
  componentSelector: string,
  actions: { [actionMethod: string]: NGRXAction },
  template = ''
) => {
  const Definition: any = Component({
    selector: componentSelector,
    template,
  })(
    class CustomChannelComponent {
      constructor(private store: Store<any>) {
        generateActionMethods(actions, this);
      }

      dispatch(action: string, payload?: any) {
        this.store.dispatch(createActionFrom(actions[action], payload));

        return this;
      }
    }
  );

  Inject(Store)(Definition, undefined, 0);

  return Definition;
};

export const createChannelComponents = (
  channels: {
    [componentSelector: string]: {
      [actionMethod: string]: NGRXAction;
    };
  },
  template = ''
) =>
  Object.keys(channels).reduce(
    (list, name) => [
      ...list,
      createChannelComponent(name, channels[name], template),
    ],
    []
  );
