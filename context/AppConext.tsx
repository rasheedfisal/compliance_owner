"use client";
import { createContext, useContext, useReducer } from "react";
import { IUser } from "../typings";

type State = {
  authUser: IUser | null;
};

type Action = {
  type: string;
  payload: IUser | null;
};

type Dispatch = (action: Action) => void;

const initialState: State = {
  authUser: null,
};

type StateContextProviderProps = { children: React.ReactNode };

const StateContext = createContext<
  | {
      state: State;
      dispatch: Dispatch;
    }
  | undefined
>(undefined);

const stateReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "SET_USER": {
      return {
        ...state,
        authUser: action.payload,
      };
    }
    default: {
      throw new Error(`Unhandled action type`);
    }
  }
};

const StateContextProvider = ({ children }: StateContextProviderProps) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const value = {
    state,
    dispatch,
  };
  return (
    <StateContext.Provider value={value}>{children}</StateContext.Provider>
  );
};

const useStateContext = () => {
  const context = useContext(StateContext);

  if (context) {
    return context;
  }

  throw new Error(`useStateContext must be used within a StateContextProvider`);
};

export { StateContextProvider, useStateContext };

const AppContext = createContext({
  currentUser: null,
  setCurrentUser: () => {},
});
export default AppContext;
