export type GlobalAuthState = {
  id: string;
  nickname: string;
  isLoggedIn: boolean;
}

export type GlobalLayoutState = {
  isAuthOpened: boolean;
}

export type GlobalState = {
  auth: GlobalAuthState;
  layout: GlobalLayoutState;
}
