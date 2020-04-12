export enum AuthStep {
  'signin',
  'signup',
}

export type AuthProp = {}

export type AuthState = {
  step: AuthStep,
}

export type SignupState = {
  id: string,
  password: string,
  nickname: string,
}

export type SignupProp = {
  setStep: (step: AuthStep) => void;
}

export type SigninProp = {
  setStep: (step: AuthStep) => void;
}

export type SigninState = {
  id: string;
  password: string;
}