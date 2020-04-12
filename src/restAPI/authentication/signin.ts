import { JSONResponse, AuthenticationSigninResponseMessage, AuthenticationSigninResponseData, AuthenticationSigninRequest } from '../../responseTypes';
import config from '../../config';
import { fetchRestAPI } from '../../commonUtils';

export type SigninOption = {
  id: string;
  password: string;
};

export default async function signin(option: SigninOption): Promise<JSONResponse<AuthenticationSigninResponseMessage, AuthenticationSigninResponseData>> {
  const url = config.debugHost + '/restAPI/authentication/signin';
  const {
    id,
    password,
  } = option;

  const response = await fetchRestAPI({
    url,
    body: {
      id,
      password,
    } as AuthenticationSigninRequest,
  });

  const json = await response.json() as JSONResponse<AuthenticationSigninResponseMessage, AuthenticationSigninResponseData>;
  return json;
}
