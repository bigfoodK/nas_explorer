import React from 'react';
import { getGlobalState } from '../../globalState';
import Signin from './Signin';
import Signup from './Signup';
import { AuthProp, AuthState, AuthStep } from './AuthInterfaces';
import './Auth.css';
import Account from './Account';

export default class Auth extends React.Component<AuthProp, AuthState> {
  constructor(prop: AuthProp) {
    super(prop);

    this.state = {
      step: AuthStep.signin,
    };

    this.setStep = this.setStep.bind(this);
  }

  private globalState = getGlobalState({
    reactComponent: this,
  });

  public setStep(step: AuthStep) {
    this.setState({
      step,
    });
  }

  render() {
    const {
      isAuthOpened,
    } = this.globalState.layout;

    const {
      isLoggedIn,
      nickname,
      id,
    } = this.globalState.auth;

    return (
      <div className = 'auth' style={{
        width: isAuthOpened ? '40vw' : '2rem',
        minWidth: isAuthOpened ? '24em' : '0px',
        padding: isAuthOpened ? '2rem .25rem 1rem .25rem' : '2rem 0px 0px 0px',
        height: isAuthOpened ? '100vh' : '2rem',
      }}>
        <div
          id="auth-toggle-button"
          onClick={ () => { this.globalState.layout.isAuthOpened = !isAuthOpened }}
        >
          {
            this.globalState.auth.isLoggedIn
              ? <i className="fas fa-user"></i>
              : <i className="far fa-user"></i>
          }
          {
            isAuthOpened
              ? isLoggedIn
                ? ` ${nickname}(${id})`
                : ' please login'
              : ''
          }
        </div>
        { isLoggedIn
          ? <Account />
          : this.state.step === AuthStep.signin
            ? <Signin setStep={ this.setStep }/>
            : <Signup setStep={ this.setStep }/>
        }
      </div>
    )
  }
}

