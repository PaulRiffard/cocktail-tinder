import { types } from "./cocktails.actions";

export const initialState = {
  pending: true,
  error: false,
  cocktail: null,
};

export default function reducer(state, action) {
  switch (action.type) {
    case types.FETCH_COCKTAIL_PENDING:
      return {
        ...state,
        pending: true,
        error: false,
      };
    case types.FETCH_COCKTAIL_ERROR:
      return {
        ...state,
        pending: false,
        error: true,
      };
    case types.FETCH_COCKTAIL_SUCCESS:
      return {
        ...state,
        pending: false,
        cocktail: action.payload,
      };
    default:
      return state;
  }
}
