import { match } from "react-router";

export interface AddressBarProps {
  match: match & {
    params: {
      viewer: string;
      path: string;
    }
  };
}