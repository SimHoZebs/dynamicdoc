import {
  Action,
  action,
  createStore,
  createTypedHooks,
} from "easy-peasy";

interface Store {
}

const globalState = createStore<Store>({

});

const typedHooks = createTypedHooks<Store>();
export const useStoreState = typedHooks.useStoreState;
export const useStoreActions = typedHooks.useStoreActions;

export default globalState;