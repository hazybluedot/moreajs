import thunkMiddleware from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import { fetchItems } from "./actions";
import loggerMiddleware from "./logger";
import rootReducer from "./reducers";

const store = createStore(
    rootReducer,
    applyMiddleware(loggerMiddleware, thunkMiddleware));

//store.dispatch(fetchItems());

export default store;
