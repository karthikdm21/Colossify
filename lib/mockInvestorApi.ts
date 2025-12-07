// Mock API endpoints for investor-founder workflows

export interface Project {
    id: string;
    title: string;
    pitch: string;
    requestedFunding: number;
    equityOffered: number;
    traction: string;
    thumbnail: string;
    tags: string[];
    founderId: string;
    founderName: string;
    hasAccess?: boolean;
    accessStatus?: 'none' | 'requested' | 'approved' | 'rejected';
}

export interface AccessRequest {
    id: string;
    projectId: string;
    investorId: string;
    investorName: string;
    investorEmail: string;
    message: string;
    ndaRequired: boolean;
    status: 'pending' | 'approved' | 'rejected' | 'more-info';
    createdAt: string;
    updatedAt: string;
}

export interface Proposal {
    id: string;
    projectId: string;
    investorId: string;
    investorName: string;
    founderId: string;
    fundingAmount: number;
    equityOffer: number;
    milestones: Milestone[];
    termSheetNotes: string;
    status: 'pending' | 'accepted' | 'countered' | 'rejected';
    createdAt: string;
    updatedAt: string;
}

export interface Milestone {
    id: string;
    description: string;
    amount: number;
    deadline: string;
}

export interface Notification {
    id: string;
    userId: string;
    type: 'access-request' | 'access-approved' | 'access-rejected' | 'proposal-received' | 'proposal-countered' | 'proposal-accepted';
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    relatedId?: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
let mockProjects: Project[] = [
    {
        id: 'proj-1',
        title: 'AI-Powered Learning Platform',
        pitch: 'Personalized education using machine learning',
        requestedFunding: 500000,
        equityOffered: 10,
        traction: '10K users, $50K MRR',
        thumbnail: 'from-blue-500 to-cyan-400',
        tags: ['EdTech', 'AI', 'SaaS'],
        founderId: 'founder-1',
        founderName: 'Sarah Chen',
    },
    {
        id: 'proj-2',
        title: 'Sustainable Food Delivery',
        pitch: 'Zero-waste delivery with reusable packaging',
        requestedFunding: 750000,
        equityOffered: 15,
        traction: '5K orders/month, 3 cities',
        thumbnail: 'from-green-500 to-emerald-400',
        tags: ['GreenTech', 'Logistics', 'B2C'],
        founderId: 'founder-2',
        founderName: 'Marcus Johnson',
    },
    {
        id: 'proj-3',
        title: 'Remote Team Collaboration Tool',
        pitch: 'Real-time workspace for distributed teams',
        requestedFunding: 1000000,
        equityOffered: 12,
        traction: '2K teams, $100K MRR',
        thumbnail: 'from-purple-500 to-pink-400',
        tags: ['SaaS', 'Productivity', 'B2B'],
        founderId: 'founder-3',
        founderName: 'Emily Rodriguez',
    },
    {
        id: 'proj-4',
        title: 'Health Monitoring Wearable',
        pitch: 'Continuous health tracking with AI insights',
        requestedFunding: 2000000,
        equityOffered: 20,
        traction: 'Prototype ready, 500 pre-orders',
        thumbnail: 'from-red-500 to-orange-400',
        tags: ['HealthTech', 'Hardware', 'IoT'],
        founderId: 'founder-4',
        founderName: 'David Kim',
    },
];

let mockAccessRequests: AccessRequest[] = [];
let mockProposals: Proposal[] = [];
let mockNotifications: Notification[] = [];

// API Functions

export async function getProjects(): Promise<Project[]> {
    await delay(600);
    return mockProjects;
}

export async function getProjectById(id: string): Promise<Project | null> {
    await delay(400);
    return mockProjects.find(p => p.id === id) || null;
}

export async function requestAccess(data: {
    projectId: string;
    investorId: string;
    investorName: string;
    investorEmail: string;
    message: string;
    ndaRequired: boolean;
}): Promise<AccessRequest> {
    await delay(800);

    const request: AccessRequest = {
        id: `req-${Date.now()}`,
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    mockAccessRequests.push(request);

    // Update project status
    const project = mockProjects.find(p => p.id === data.projectId);
    if (project) {
        project.accessStatus = 'requested';
    }

    // Create notification for founder
    const projectData = mockProjects.find(p => p.id === data.projectId);
    if (projectData) {
        mockNotifications.push({
            id: `notif-${Date.now()}`,
            userId: projectData.founderId,
            type: 'access-request',
            title: 'New Access Request',
            message: `${data.investorName} requested access to ${projectData.title}`,
            read: false,
            createdAt: new Date().toISOString(),
            relatedId: request.id,
        });
    }

    return request;
}

export async function getAccessRequests(founderId: string): Promise<AccessRequest[]> {
    await delay(500);
    return mockAccessRequests.filter(req => {
        const project = mockProjects.find(p => p.id === req.projectId);
        return project?.founderId === founderId;
    });
}

export async function respondToAccessRequest(
    requestId: string,
    status: 'approved' | 'rejected' | 'more-info',
    message?: string
): Promise<AccessRequest> {
    await delay(700);

    const request = mockAccessRequests.find(r => r.id === requestId);
    if (!request) throw new Error('Request not found');

    request.status = status;
    request.updatedAt = new Date().toISOString();

    // Update project access
    const project = mockProjects.find(p => p.id === request.projectId);
    if (project && status === 'approved') {
        project.accessStatus = 'approved';
        project.hasAccess = true;
    }

    // Create notification for investor
    mockNotifications.push({
        id: `notif-${Date.now()}`,
        userId: request.investorId,
        type: status === 'approved' ? 'access-approved' : 'access-rejected',
        title: status === 'approved' ? 'Access Granted' : 'Access Denied',
        message: `Your access request for ${project?.title} was ${status}`,
        read: false,
        createdAt: new Date().toISOString(),
        relatedId: requestId,
    });

    return request;
}

export async function createProposal(data: {
    projectId: string;
    investorId: string;
    investorName: string;
    founderId: string;
    fundingAmount: number;
    equityOffer: number;
    milestones: Milestone[];
    termSheetNotes: string;
}): Promise<Proposal> {
    await delay(1000);

    const proposal: Proposal = {
        id: `prop-${Date.now()}`,
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    mockProposals.push(proposal);

    // Create notification for founder
    const project = mockProjects.find(p => p.id === data.projectId);
    mockNotifications.push({
        id: `notif-${Date.now()}`,
        userId: data.founderId,
        type: 'proposal-received',
        title: 'New Proposal Received',
        message: `${data.investorName} sent a proposal for ${project?.title}`,
        read: false,
        createdAt: new Date().toISOString(),
        relatedId: proposal.id,
    });

    return proposal;
}

export async function getProposals(userId: string, role: 'investor' | 'founder'): Promise<Proposal[]> {
    await delay(600);

    if (role === 'investor') {
        return mockProposals.filter(p => p.investorId === userId);
    } else {
        return mockProposals.filter(p => p.founderId === userId);
    }
}

export async function counterProposal(
    proposalId: string,
    data: {
        fundingAmount: number;
        equityOffer: number;
        milestones: Milestone[];
        termSheetNotes: string;
    }
): Promise<Proposal> {
    await delay(800);

    const proposal = mockProposals.find(p => p.id === proposalId);
    if (!proposal) throw new Error('Proposal not found');

    proposal.fundingAmount = data.fundingAmount;
    proposal.equityOffer = data.equityOffer;
    proposal.milestones = data.milestones;
    proposal.termSheetNotes = data.termSheetNotes;
    proposal.status = 'countered';
    proposal.updatedAt = new Date().toISOString();

    // Create notification for investor
    mockNotifications.push({
        id: `notif-${Date.now()}`,
        userId: proposal.investorId,
        type: 'proposal-countered',
        title: 'Proposal Countered',
        message: `Counter-proposal received for your offer`,
        read: false,
        createdAt: new Date().toISOString(),
        relatedId: proposalId,
    });

    return proposal;
}

export async function acceptProposal(proposalId: string): Promise<Proposal> {
    await delay(700);

    const proposal = mockProposals.find(p => p.id === proposalId);
    if (!proposal) throw new Error('Proposal not found');

    proposal.status = 'accepted';
    proposal.updatedAt = new Date().toISOString();

    // Create notification
    mockNotifications.push({
        id: `notif-${Date.now()}`,
        userId: proposal.investorId,
        type: 'proposal-accepted',
        title: 'Proposal Accepted!',
        message: `Your proposal has been accepted`,
        read: false,
        createdAt: new Date().toISOString(),
        relatedId: proposalId,
    });

    return proposal;
}

export async function rejectProposal(proposalId: string): Promise<Proposal> {
    await delay(700);

    const proposal = mockProposals.find(p => p.id === proposalId);
    if (!proposal) throw new Error('Proposal not found');

    proposal.status = 'rejected';
    proposal.updatedAt = new Date().toISOString();

    return proposal;
}

export async function getNotifications(userId: string): Promise<Notification[]> {
    await delay(400);
    return mockNotifications.filter(n => n.userId === userId).sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export async function markNotificationRead(notificationId: string): Promise<void> {
    await delay(300);
    const notification = mockNotifications.find(n => n.id === notificationId);
    if (notification) {
        notification.read = true;
    }
}

export async function getAuditLog(projectId: string): Promise<any[]> {
    await delay(500);

    const logs: any[] = [];

    // Access requests
    mockAccessRequests
        .filter(r => r.projectId === projectId)
        .forEach(r => {
            logs.push({
                id: `log-${r.id}`,
                type: 'access-request',
                actor: r.investorName,
                action: `Requested access`,
                timestamp: r.createdAt,
                status: r.status,
            });

            if (r.status !== 'pending') {
                logs.push({
                    id: `log-${r.id}-response`,
                    type: 'access-response',
                    actor: 'Founder',
                    action: `${r.status} access request`,
                    timestamp: r.updatedAt,
                    status: r.status,
                });
            }
        });

    // Proposals
    mockProposals
        .filter(p => p.projectId === projectId)
        .forEach(p => {
            logs.push({
                id: `log-${p.id}`,
                type: 'proposal',
                actor: p.investorName,
                action: `Submitted proposal ($${p.fundingAmount.toLocaleString()}, ${p.equityOffer}% equity)`,
                timestamp: p.createdAt,
                status: p.status,
            });

            if (p.status === 'countered') {
                logs.push({
                    id: `log-${p.id}-counter`,
                    type: 'counter-proposal',
                    actor: 'Founder',
                    action: `Sent counter-proposal`,
                    timestamp: p.updatedAt,
                    status: p.status,
                });
            }
        });

    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// Helper function to get thumbnail gradient based on category
function getThumbnailGradient(category: string): string {
    const gradients: Record<string, string> = {
        'AI/ML': 'from-blue-500 to-cyan-400',
        'EdTech': 'from-blue-500 to-cyan-400',
        'FinTech': 'from-yellow-500 to-orange-400',
        'HealthTech': 'from-red-500 to-orange-400',
        'E-commerce': 'from-purple-500 to-pink-400',
        'SaaS': 'from-purple-500 to-pink-400',
        'GreenTech': 'from-green-500 to-emerald-400',
        'Other': 'from-gray-500 to-gray-400',
    };
    return gradients[category] || 'from-gray-500 to-gray-400';
}

// Add new project to the mock data
export async function addProject(data: {
    title: string;
    description: string;
    category: string;
    requestedFunding: number;
    equityOffered: number;
    founderId: string;
    founderName: string;
}): Promise<Project> {
    await delay(500);

    const newProject: Project = {
        id: `proj-${Date.now()}`,
        title: data.title,
        pitch: data.description,
        requestedFunding: data.requestedFunding,
        equityOffered: data.equityOffered,
        traction: 'Just launched',
        thumbnail: getThumbnailGradient(data.category),
        tags: [data.category],
        founderId: data.founderId,
        founderName: data.founderName,
    };

    mockProjects.push(newProject);
    return newProject;
}

