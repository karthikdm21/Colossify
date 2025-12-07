import { create } from 'zustand';

interface Idea {
    id: string;
    title: string;
    description: string;
    category: string;
    status: 'draft' | 'submitted' | 'validated' | 'published';
    score?: number;
    createdAt: Date;
}

interface IdeaStore {
    ideas: Idea[];
    currentIdea: Partial<Idea>;
    addIdea: (idea: Idea) => void;
    updateCurrentIdea: (data: Partial<Idea>) => void;
    clearCurrentIdea: () => void;
}

export const useIdeaStore = create<IdeaStore>((set) => ({
    ideas: [],
    currentIdea: {},
    addIdea: (idea) => set((state) => ({ ideas: [...state.ideas, idea] })),
    updateCurrentIdea: (data) => set((state) => ({ currentIdea: { ...state.currentIdea, ...data } })),
    clearCurrentIdea: () => set({ currentIdea: {} }),
}));

interface UIStore {
    isModalOpen: boolean;
    modalContent: React.ReactNode | null;
    openModal: (content: React.ReactNode) => void;
    closeModal: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
    isModalOpen: false,
    modalContent: null,
    openModal: (content) => set({ isModalOpen: true, modalContent: content }),
    closeModal: () => set({ isModalOpen: false, modalContent: null }),
}));
