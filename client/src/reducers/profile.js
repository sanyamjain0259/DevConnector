import * as actions from "../actions/types";
const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {},
};
export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case actions.GET_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false,
      };
    case actions.PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case actions.UPDATE_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false,
      };
    case actions.CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        repos: [],
        loading: false,
      };
    default:
      return state;
  }
}
