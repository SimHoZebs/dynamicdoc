import { Page, User } from "@prisma/client";
import {
  Action,
  action,
  createStore,
  createTypedHooks,
} from "easy-peasy";

interface Store {
  user: User;
  setUser: Action<Store, User>;
  pageArray: Page[];
  setPageArray: Action<Store, Page[]>;
}

const globalState = createStore<Store>({
  user: { id: 0 },
  setUser: action((state, payload) => {
    state.user = payload;
  }),
  pageArray: [],
  setPageArray: action((state, payload) => {
    state.pageArray = payload;
  })

});

const typedHooks = createTypedHooks<Store>();
export const useStoreState = typedHooks.useStoreState;
export const useStoreActions = typedHooks.useStoreActions;

export default globalState;