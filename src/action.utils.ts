import { Action } from '@ngrx/store';

type ActionCreator = (payload: any) => Action & { payload: any };

export type NGRXAction = string | Action | ActionCreator;

export const createActionFrom = (
  action: string | Action | ActionCreator,
  payload: any
) => {
  if (typeof action === 'string') {
    return { type: action, payload };
  }

  if (typeof action === 'function') {
    return action(payload);
  }

  if (action && typeof action === 'object') {
    let currentAction = Object.create(action);

    if (payload !== undefined) {
      Object.assign(currentAction, { payload });
    }

    return currentAction;
  }
};
