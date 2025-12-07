import { create } from 'zustand';
import { Project, AccessRequest, Proposal, Notification } from './mockInvestorApi';

interface InvestorStore {
    currentUser: {
        id: string;
        name: string;
        email: string;
        role: 'investor' | 'founder';
    };
    projects: Project[];
    accessRequests: AccessRequest[];
    proposals: Proposal[];
    notifications: Notification[];
    unreadCount: number;

    setProjects: (projects: Project[]) => void;
    addProject: (project: Project) => void;
    updateProject: (id: string, updates: Partial<Project>) => void;
    setAccessRequests: (requests: AccessRequest[]) => void;
    addAccessRequest: (request: AccessRequest) => void;
    updateAccessRequest: (id: string, updates: Partial<AccessRequest>) => void;
    setProposals: (proposals: Proposal[]) => void;
    addProposal: (proposal: Proposal) => void;
    updateProposal: (id: string, updates: Partial<Proposal>) => void;
    setNotifications: (notifications: Notification[]) => void;
    addNotification: (notification: Notification) => void;
    markNotificationRead: (id: string) => void;
    setCurrentUser: (user: { id: string; name: string; email: string; role: 'investor' | 'founder' }) => void;
}

export const useInvestorStore = create<InvestorStore>((set) => ({
    currentUser: {
        id: 'investor-1',
        name: 'Alex Thompson',
        email: 'alex@venture.com',
        role: 'investor',
    },
    projects: [],
    accessRequests: [],
    proposals: [],
    notifications: [],
    unreadCount: 0,

    setProjects: (projects) => set({ projects }),

    addProject: (project) => set((state) => ({
        projects: [...state.projects, project],
    })),

    updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p),
    })),

    setAccessRequests: (requests) => set({ accessRequests: requests }),

    addAccessRequest: (request) => set((state) => ({
        accessRequests: [...state.accessRequests, request],
    })),

    updateAccessRequest: (id, updates) => set((state) => ({
        accessRequests: state.accessRequests.map(r => r.id === id ? { ...r, ...updates } : r),
    })),

    setProposals: (proposals) => set({ proposals }),

    addProposal: (proposal) => set((state) => ({
        proposals: [...state.proposals, proposal],
    })),

    updateProposal: (id, updates) => set((state) => ({
        proposals: state.proposals.map(p => p.id === id ? { ...p, ...updates } : p),
    })),

    setNotifications: (notifications) => set({
        notifications,
        unreadCount: notifications.filter(n => !n.read).length,
    }),

    addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
    })),

    markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
        unreadCount: Math.max(0, state.unreadCount - 1),
    })),

    setCurrentUser: (user) => set({ currentUser: user }),
}));
