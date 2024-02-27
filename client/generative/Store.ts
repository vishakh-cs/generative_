import create from 'zustand';

const useUserStore = create((set) => ({
  users: [],
  setUsers: (data) => set((state) => ({ users: data })),
}));

export default useUserStore;
