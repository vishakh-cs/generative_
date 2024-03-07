// workspace data store

import { create } from 'zustand';

export const useStore = create((set) => ({
  isLogoutClicked: false,
  workspaceName: '',
  setLogoutClicked: (value) => set({ isLogoutClicked: value }),
  resetLogoutClicked: () => set({ isLogoutClicked: false }),
  setWorkspaceName: (name) => set({ workspaceName: name }), 
  resetWorkspaceName: () => set({ workspaceName: '' }),
}));

export default useStore;
