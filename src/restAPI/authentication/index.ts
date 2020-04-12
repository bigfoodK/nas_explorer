import Cookie from 'cookie';
import signin, { SigninOption } from './signin';
import signup from './signup';
import { getGlobalState } from '../../globalState';

const globalState = getGlobalState({});

const Authentication = {
  signin: async (option: SigninOption) => {
    const response = await signin(option);
    if (response.isSuccessful) {
      document.cookie = Cookie.serialize('AuthorizationToken', response.data.jwt);
      localStorage.setItem('authorizationToken', response.data.jwt);
      localStorage.setItem('id', response.data.id);
      localStorage.setItem('nickname', response.data.nickname);
      globalState.auth.id = response.data.id;
      globalState.auth.nickname = response.data.nickname;
      globalState.auth.isLoggedIn = true;
    }
    return response;
  },
  signup,
  signout: () => {
    document.cookie = Cookie.serialize('AuthorizationToken', '');
    localStorage.setItem('authorizationToken', '');
    localStorage.setItem('id', '');
    localStorage.setItem('nickname', '');
    globalState.auth.id = '';
    globalState.auth.nickname = '';
    globalState.auth.isLoggedIn = false;
  },
  autoSignin: () => {
    const authorizationToken = localStorage.getItem('authorizationToken');
    if (!authorizationToken) {
      return;
    }
    const id = localStorage.getItem('id');
    const nickname = localStorage.getItem('nickname');

    if (!id || !nickname) {
      Authentication.signout();
      return;
    }

    globalState.auth.id = id;
    globalState.auth.nickname = nickname;
    globalState.auth.isLoggedIn = true;
  }
};

export default Authentication;
