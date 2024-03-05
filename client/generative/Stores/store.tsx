import create from 'zustand';

export const useStore = create((set) => ({
  isLogoutClicked: false,
  setLogoutClicked: (value) => set({ isLogoutClicked: value }),
  resetLogoutClicked: () => set({ isLogoutClicked: false }),
}));

export default useStore;
