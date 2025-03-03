import { applyMiddleware, compose, createStore } from "redux";
import thunkMiddleware from "redux-thunk";

import monitorReducersEnhancer from "./middleware/monitorReducers";
import loggerMiddleware from "./middleware/logger";
import rootReducer from "./reducers";

function configureStore() {
  const middlewares: any[] = [loggerMiddleware, thunkMiddleware];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = [middlewareEnhancer, monitorReducersEnhancer];
  const composedEnhancers = compose(...enhancers);

  // @ts-ignore
  const store = createStore(rootReducer, undefined, composedEnhancers);

  return store;
}

export const store = configureStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
