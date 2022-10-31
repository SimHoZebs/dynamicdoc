import {
  Action,
  action,
  createStore,
  createTypedHooks,
} from "easy-peasy";

import { Page } from "./types";

interface Store {
  documentArray: Page[];
  setDocumentArray: Action<Store, Page[]>;
}

const globalState = createStore<Store>({
  documentArray: [],
  setDocumentArray: action((state, payload) => {
    state.documentArray = payload;
  })

});

const typedHooks = createTypedHooks<Store>();
export const useStoreState = typedHooks.useStoreState;
export const useStoreActions = typedHooks.useStoreActions;

export default globalState;