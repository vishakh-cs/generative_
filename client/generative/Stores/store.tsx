import { create } from 'zustand';

interface StoreState {
  userEmail: string;
  isLogoutClicked: boolean;
  workspaceName: string;
  isProfileClicked: boolean;
  workspaceId: string;
  workspaceType: string; 
  collaboratorWorkspace: {
    _id: string;
    name: string;
    workspaceLogoIndex: number;
    owner: string;
    collaborators: string[];
    createdAt: string;
    pages: string[];
    type: string;
  } | null;
}

interface StoreActions {
  setUserEmail(userEmail: string): void;
  setLogoutClicked: (value: boolean) => void;
  resetLogoutClicked: () => void;
  setWorkspaceName: (name: string) => void;
  resetWorkspaceName: () => void;
  setWorkspaceId: (id: string) => void;
  setWorkspaceType: (type: string) => void;
  setCollaboratorWorkspace: (collabWorkspace: StoreState['collaboratorWorkspace']) => void;

}

export const useStore = create<StoreState & StoreActions>((set) => ({
  userEmail: '',
  isLogoutClicked: false,
  workspaceName: '',
  isProfileClicked: false,
  workspaceId: '',
  workspaceType:'',
  collaboratorWorkspace: null,

  setUserEmail: (email) => set({ userEmail:  email.toLowerCase() }),

  setLogoutClicked: (value) => set({ isLogoutClicked: value }),
  resetLogoutClicked: () => set({ isLogoutClicked: false }),
  
  setWorkspaceName: (name) => set({ workspaceName: name }),
  resetWorkspaceName: () => set({ workspaceName: '' }),

  setWorkspaceId: (id) => set({ workspaceId: id }),
  setWorkspaceType: (type) => set({ workspaceType: type }),
  setCollaboratorWorkspace: (collabWorkspace) => set({ collaboratorWorkspace: collabWorkspace }),
}));

export default useStore;
