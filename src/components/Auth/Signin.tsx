import React from 'react';
import { SigninProp, SigninState, AuthStep} from './AuthInterfaces';
import './Signin.css';
import RestAPI from '../../restAPI';

export default class Signin extends React.Component<SigninProp, SigninState> {
  constructor(prop: SigninProp) {
    super(prop);

    this.state = {
      id: '',
      password: '',
    };

    this.signin = this.signin.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleIdChange = this.handleIdChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  private async signin() {
    const {
      id,
      password,
    } = this.state;

    const response = await RestAPI.Authentication.signin({
      id,
      password,
    });

    console.log(response);
  }

  private handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    switch(event.key) {
      case 'Enter': {
        this.signin();
        break;
      }
      default:
    }
  }

  private handleIdChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      id: event.target.value,
    });
  }

  private handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      password: event.target.value,
    });
  }

  public render() {
    return (
      <div className = 'signin'>
        <input
          value={this.state.id}
          onChange={ this.handleIdChange }
          placeholder="ID"
        />
        <input
          value={ this.state.password }
          onChange={ this.handlePasswordChange }
          placeholder="Password"
          type="password"
          onKeyPress={ this.handleKeyPress }
        />
        <div
          onClick={ this.signin }
          className="button"
        >signin</div>
        <div
          onClick={ () => { this.props.setStep(AuthStep.signup) } }
          className="button"
        >signup</div>
      </div>
    )
  }
}
