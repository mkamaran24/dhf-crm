
export interface StageHistory {
    stage: string;
    completedAt: string;
    completedBy: string;
}

export interface LeadProgress {
    id: number;
    name: string;
    leadId: string;
    stages: string[]; // List of completed stages
    history: StageHistory[]; // History of stage updates
    currentStage: string;
    lost: boolean;
    lostReason?: string;
    lastUpdated?: string;
    avatar?: string;
    notes?: string;
}

export const STAGES = [
    { id: "new", label: "New" },
    { id: "contacted", label: "Contacted" },
    { id: "followup", label: "Follow-up" },
    { id: "ready", label: "Ready" },
    { id: "appointment", label: "Appointment Booked" },
    { id: "converted", label: "Converted" },
];

export const mockLeadsProgress: LeadProgress[] = [
    {
        id: 1,
        name: "John Doe",
        leadId: "LD-001",
        stages: ["New", "Contacted", "Follow-up"],
        history: [
            { stage: "New", completedAt: "2023-10-20 09:00", completedBy: "Admin Ali" },
            { stage: "Contacted", completedAt: "2023-10-21 14:30", completedBy: "Agent Sara" },
            { stage: "Follow-up", completedAt: "2023-10-22 10:00", completedBy: "Admin Omer" },
            { stage: "Follow-up", completedAt: "2023-10-23 11:15", completedBy: "Admin Ali" },
            { stage: "Follow-up", completedAt: "2023-10-24 15:00", completedBy: "Admin Omer" },
            { stage: "Follow-up", completedAt: "2023-10-25 09:45", completedBy: "Admin Sara" },
            { stage: "Follow-up", completedAt: "2023-10-26 13:20", completedBy: "Admin Ali" }
        ],
        currentStage: "Follow-up",
        lost: false,
        lastUpdated: "2023-10-21",
    },
    {
        id: 2,
        name: "Jane Smith",
        leadId: "LD-002",
        stages: ["New", "Contacted", "Follow-up"],
        history: [
            { stage: "New", completedAt: "2023-10-18 10:00", completedBy: "Admin Ali" },
            { stage: "Contacted", completedAt: "2023-10-19 11:00", completedBy: "Agent Sara" },
            { stage: "Follow-up", completedAt: "2023-10-22 16:45", completedBy: "Admin Omer" }
        ],
        currentStage: "Follow-up",
        lost: true,
        lostReason: "Patient decided to postpone treatment after follow-up call",
        lastUpdated: "2023-10-24",
    },
    {
        id: 3,
        name: "Robert Brown",
        leadId: "LD-003",
        stages: ["New", "Contacted", "Follow-up", "Ready", "Appointment Booked"],
        history: [
            { stage: "New", completedAt: "2023-10-15 08:30", completedBy: "System" },
            { stage: "Contacted", completedAt: "2023-10-16 12:00", completedBy: "Agent Sara" },
            { stage: "Follow-up", completedAt: "2023-10-18 15:20", completedBy: "Admin Omer" },
            { stage: "Ready", completedAt: "2023-10-20 10:15", completedBy: "Admin Ali" },
            { stage: "Appointment Booked", completedAt: "2023-10-25 09:30", completedBy: "Admin Ali" }
        ],
        currentStage: "Appointment Booked",
        lost: false,
        lastUpdated: "2023-10-26",
    },
    {
        id: 5,
        name: "Michael Wilson",
        leadId: "LD-005",
        stages: ["New", "Contacted", "Follow-up", "Ready", "Appointment Booked", "Converted"],
        history: [
            { stage: "New", completedAt: "2023-10-01 09:00", completedBy: "Admin Ali" },
            { stage: "Contacted", completedAt: "2023-10-02 10:00", completedBy: "Agent Sara" },
            { stage: "Follow-up", completedAt: "2023-10-05 14:00", completedBy: "Admin Omer" },
            { stage: "Ready", completedAt: "2023-10-10 11:00", completedBy: "Admin Ali" },
            { stage: "Appointment Booked", completedAt: "2023-10-15 15:00", completedBy: "Admin Ali" },
            { stage: "Converted", completedAt: "2023-10-20 12:00", completedBy: "Admin Omer" }
        ],
        currentStage: "Converted",
        lost: false,
        lastUpdated: "2023-10-20",
    }
];
