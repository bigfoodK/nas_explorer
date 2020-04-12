import { JSONResponse, AuthenticationSignupResponseMessage, AuthenticationSignupResponseData, AuthenticationSignupRequest } from '../../responseTypes';
import config from '../../config';
import { fetchRestAPI } from '../../commonUtils';

export type SignupOption = {
  id: string;
  password: string;
  nickname: string;
};

export default async function signup(option: SignupOption): Promise<JSONResponse<AuthenticationSignupResponseMessage, AuthenticationSignupResponseData>> {
  const url = config.debugHost + '/restAPI/authentication/signup';
  const {
    id,
    password,
    nickname,
  } = option;

  const response = await fetchRestAPI({
    url,
    body: {
      id,
      password,
      nickname,
    } as AuthenticationSignupRequest,
  });

  const json = await response.json() as JSONResponse<AuthenticationSignupResponseMessage, AuthenticationSignupResponseData>;
  return json;
}
