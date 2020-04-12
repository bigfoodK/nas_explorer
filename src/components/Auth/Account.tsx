import React from 'react';
import './Account.css';
import RestAPI from '../../restAPI';
import { getGlobalState } from '../../globalState';

export default class Account extends React.Component {
  constructor(prop: any) {
    super(prop);
  }

  private globalState = getGlobalState({
    reactComponent: this,
  });

  public render() {
    const {
      id,
      nickname,
    } = this.globalState.auth;

    return (
      <div className = 'account'>
        <div
          onClick={ RestAPI.Authentication.signout }
          className="button"
        >logout</div>
        <div>{ `hi ${nickname}(${id})` }</div>
      </div>
    )
  }
}
