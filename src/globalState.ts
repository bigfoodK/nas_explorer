import React from 'react';
import createObserverProxy, { Observer } from 'observer-proxy';
import { GlobalState } from './globalStateTypes';

export type GetGlobalStateOption = {
  reactComponent?: React.Component;
}

const globalState: GlobalState = {
  auth: {
    id: '',
    nickname: '',
    isLoggedIn: false,
  },
  layout: {
    isAuthOpened: false,
  }
};

export function getGlobalState(option: GetGlobalStateOption) {
  const {
    reactComponent,
  } = option;

  const observer = new Observer({
    onStateUpdate: () => {
      if (reactComponent) {
        reactComponent.forceUpdate();
      }
    },
  });

  if (reactComponent) {
    const componentWillUnmountFunction = reactComponent.componentWillUnmount;
    reactComponent.componentWillUnmount = () => {
      observer.stopObserving();
      if (componentWillUnmountFunction) {
        componentWillUnmountFunction.call(reactComponent);
      }
    }
  }

  const observerProxy = createObserverProxy(globalState, observer);
  return observerProxy;
}
