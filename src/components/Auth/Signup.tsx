import React from 'react';
import './Signup.css';
import { SignupProp, SignupState, AuthStep } from './AuthInterfaces'
import RestAPI from '../../restAPI';

export default class Signup extends React.Component<SignupProp, SignupState> {
  constructor(prop: SignupProp) {
    super(prop);
    this.state = {
      id: '',
      password: '',
      nickname: '',
    };

    this.signup = this.signup.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleIdChange = this.handleIdChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleNickNameChange = this.handleNickNameChange.bind(this);
  }

  public async signup() {
    const {
      id,
      password,
      nickname,
    } = this.state;

    const response = await RestAPI.Authentication.signup({
      id,
      nickname,
      password,
    });

    console.log(response);
  }

  private handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    switch(event.key) {
      case 'Enter': {
        this.signup();
        break;
      }
      default:
    }
  }

  public handleIdChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      id: event.target.value,
    });
  }

  public handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      password: event.target.value,
    });
  }

  public handleNickNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      nickname: event.target.value,
    });
  }

  public render() {
    return (
      <div className = 'signup'>
        <input
          value={ this.state.id }
          onChange={ this.handleIdChange }
          placeholder="ID"
        />
        <input
          value={ this.state.password }
          onChange={ this.handlePasswordChange }
          placeholder="Password"
          type="password"
        />
        <input
          value={ this.state.nickname }
          onChange={ this.handleNickNameChange }
          placeholder="Nickname"
          onKeyPress={ this.handleKeyPress }
        />
        <div
          onClick={ this.signup }
          className="button"
        >signup</div>
        <div
          onClick={ () => {this.props.setStep(AuthStep.signin)} }
          className="button"
        >go back</div>
      </div>
    )
  }
}
