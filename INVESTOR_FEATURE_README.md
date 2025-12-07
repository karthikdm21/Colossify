# Investor-Founder Workflow Feature

## Overview

This feature adds comprehensive investor-founder access request and proposal workflows to Colossify. It enables investors to discover projects, request access, and make investment proposals, while founders can manage access requests and negotiate proposals.

## New Routes

### Investor Routes
- **`/investor`** - Investor dashboard showing all available projects with request/proposal actions

### Founder Routes
- **`/founder`** - Founder dashboard with tabs for access requests and proposals

## Mock API Endpoints

All API endpoints are mocked in `/lib/mockInvestorApi.ts` with realistic delays and state management.

### Projects
- **`GET /api/projects`** - Get all available projects
  ```typescript
  Response: Project[]
  ```

### Access Requests
- **`POST /api/access-request`** - Submit access request
  ```typescript
  Request: {
    projectId: string;
    investorId: string;
    investorName: string;
    investorEmail: string;
    message: string;
    ndaRequired: boolean;
  }
  Response: AccessRequest
  ```

- **`GET /api/access-requests?founderId={id}`** - Get access requests for founder
  ```typescript
  Response: AccessRequest[]
  ```

- **`POST /api/access-response`** - Respond to access request
  ```typescript
  Request: {
    requestId: string;
    status: 'approved' | 'rejected' | 'more-info';
    message?: string;
  }
  Response: AccessRequest
  ```

### Proposals
- **`POST /api/proposals`** - Create investment proposal
  ```typescript
  Request: {
    projectId: string;
    investorId: string;
    investorName: string;
    founderId: string;
    fundingAmount: number;
    equityOffer: number;
    milestones: Milestone[];
    termSheetNotes: string;
  }
  Response: Proposal
  ```

- **`GET /api/proposals?userId={id}&role={investor|founder}`** - Get proposals
  ```typescript
  Response: Proposal[]
  ```

- **`POST /api/proposals/:id/counter`** - Send counter-proposal
  ```typescript
  Request: {
    fundingAmount: number;
    equityOffer: number;
    milestones: Milestone[];
    termSheetNotes: string;
  }
  Response: Proposal
  ```

- **`POST /api/proposals/:id/accept`** - Accept proposal
  ```typescript
  Response: Proposal
  ```

- **`POST /api/proposals/:id/reject`** - Reject proposal
  ```typescript
  Response: Proposal
  ```

### Notifications
- **`GET /api/notifications?userId={id}`** - Get user notifications
  ```typescript
  Response: Notification[]
  ```

- **`POST /api/notifications/:id/read`** - Mark notification as read
  ```typescript
  Response: void
  ```

### Audit Log
- **`GET /api/audit-log?projectId={id}`** - Get project activity log
  ```typescript
  Response: AuditLogEntry[]
  ```

## Components

### Investor Components (`/components/investor/`)

#### InvestorSummaryCard
Displays project summary with key metrics and action buttons.

**Props:**
```typescript
{
  project: Project;
  onRequestAccess: (projectId: string) => void;
  onMakeProposal: (projectId: string) => void;
}
```

#### AccessRequestModal
Modal for composing access request with message and NDA option.

**Props:**
```typescript
{
  projectTitle: string;
  onSubmit: (message: string, ndaRequired: boolean) => void;
  onClose: () => void;
}
```

#### ProposalBuilder
Multi-step wizard for creating investment proposals.

**Props:**
```typescript
{
  projectTitle: string;
  projectId: string;
  onSubmit: (data: ProposalData) => void;
  onClose: () => void;
}
```

**Steps:**
1. Funding Terms (amount, equity %)
2. Milestones (description, amount, deadline)
3. Term Sheet Notes
4. Review & Submit

### Founder Components (`/components/founder/`)

#### AccessRequestList
List of incoming access requests with approve/reject actions.

**Props:**
```typescript
{
  requests: AccessRequest[];
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
  onRequestMoreInfo: (requestId: string) => void;
}
```

#### ProposalInbox
Grid of investment proposals with status badges.

**Props:**
```typescript
{
  proposals: Proposal[];
  onAccept: (proposalId: string) => void;
  onCounter: (proposalId: string, data: any) => void;
  onReject: (proposalId: string) => void;
}
```

#### ProposalModal
View and edit proposal details, send counter-proposals.

**Props:**
```typescript
{
  proposal: Proposal;
  onClose: () => void;
  onCounter?: (data: ProposalData) => void;
}
```

### Shared Components (`/components/shared/`)

#### NotificationBell
Dropdown notification center with unread badge counter.

**Features:**
- Real-time notification polling (30s interval)
- Unread count badge
- Click to mark as read
- Auto-refresh

#### AuditLog
Timeline of project activity (access requests, proposals, responses).

**Props:**
```typescript
{
  projectId: string;
}
```

## State Management

### Zustand Store (`/lib/investorStore.ts`)

```typescript
interface InvestorStore {
  currentUser: User;
  projects: Project[];
  accessRequests: AccessRequest[];
  proposals: Proposal[];
  notifications: Notification[];
  unreadCount: number;
  
  // Actions
  setProjects: (projects: Project[]) => void;
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
  setCurrentUser: (user: User) => void;
}
```

## User Flows

### Investor Flow

1. **Browse Projects** → Navigate to `/investor`
2. **Request Access** → Click "Request Access" on project card
3. **Compose Message** → Fill in message, optionally require NDA
4. **Submit Request** → Request sent to founder, card shows "Access Requested"
5. **Wait for Approval** → Receive notification when founder responds
6. **Make Proposal** → After approval, click "Make Proposal"
7. **Build Proposal** → Complete 4-step wizard (terms, milestones, notes, review)
8. **Submit Proposal** → Proposal sent to founder
9. **Negotiate** → Receive counter-proposals, adjust terms

### Founder Flow

1. **View Requests** → Navigate to `/founder`, see "Access Requests" tab
2. **Review Request** → See investor info, message, NDA requirement
3. **Approve/Reject** → Grant or deny access
4. **View Proposals** → Switch to "Proposals" tab
5. **Review Proposal** → See funding amount, equity, milestones, terms
6. **Accept/Counter/Reject** → 
   - Accept: Deal complete
   - Counter: Edit terms and send back
   - Reject: Decline proposal
7. **Negotiate** → Continue counter-proposal exchanges

## Permissions & Access Control

### Frontend-Only Gating
- Projects show limited info until access is granted
- `accessStatus` field tracks: `none`, `requested`, `approved`, `rejected`
- `hasAccess` boolean enables full project view
- UI conditionally renders based on access state

### Permission Badge
Visual indicator showing access level (read-only, full access, etc.)

## Notifications

### Notification Types
- `access-request` - New access request received
- `access-approved` - Access request approved
- `access-rejected` - Access request rejected
- `proposal-received` - New proposal received
- `proposal-countered` - Counter-proposal received
- `proposal-accepted` - Proposal accepted

### Notification Display
- Bell icon in header with badge counter
- Dropdown list with unread highlighting
- Click to mark as read
- Auto-refresh every 30 seconds

## Styling

All components follow the existing OpenAI-style dark theme:
- Dark background (`#0a0a0a`)
- Card backgrounds (`#111111`)
- Accent color (`#10a37f`)
- Large rounded corners (`rounded-2xl`, `rounded-3xl`)
- Smooth animations (fade, slide, scale)
- Hover effects with lift and glow

## Accessibility

- ARIA labels on interactive elements
- Keyboard navigation support
- Focus states on all inputs and buttons
- Screen reader friendly notifications
- Semantic HTML structure

## Demo Instructions

1. **Start as Investor:**
   ```
   Navigate to /investor
   Browse projects
   Click "Request Access" on any project
   Fill in message and submit
   ```

2. **Switch to Founder:**
   ```
   Navigate to /founder
   See access request in "Access Requests" tab
   Click "Accept"
   ```

3. **Return to Investor:**
   ```
   Refresh /investor
   Project now shows "Make Proposal" button
   Click and complete proposal wizard
   Submit proposal
   ```

4. **Back to Founder:**
   ```
   Navigate to /founder
   Switch to "Proposals" tab
   Click "Counter" on proposal
   Edit terms and send counter-proposal
   ```

## Example Payloads

### Access Request
```json
{
  "projectId": "proj-1",
  "investorId": "investor-1",
  "investorName": "Alex Thompson",
  "investorEmail": "alex@venture.com",
  "message": "I'm interested in your AI learning platform. I have 10 years of experience in EdTech and would love to discuss potential investment.",
  "ndaRequired": true
}
```

### Proposal
```json
{
  "projectId": "proj-1",
  "investorId": "investor-1",
  "investorName": "Alex Thompson",
  "founderId": "founder-1",
  "fundingAmount": 500000,
  "equityOffer": 10,
  "milestones": [
    {
      "id": "1",
      "description": "MVP Launch",
      "amount": 200000,
      "deadline": "2026-03-01"
    },
    {
      "id": "2",
      "description": "10K Active Users",
      "amount": 300000,
      "deadline": "2026-06-01"
    }
  ],
  "termSheetNotes": "Standard terms with 1x liquidation preference. Board seat included."
}
```

## Technical Notes

- All state is client-side only (no backend)
- Mock API uses `setTimeout` for realistic delays
- Data persists in memory during session
- Notifications poll every 30 seconds
- Audit log auto-updates on actions
- Responsive design with Tailwind breakpoints
