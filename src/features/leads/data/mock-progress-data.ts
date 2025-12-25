
export interface LeadStage {
    name: string;
    label: string;
    completed: boolean;
}

export interface LeadProgress {
    id: number;
    name: string;
    leadId: string;
    stages: string[]; // List of completed stages
    currentStage: string;
    lost: boolean;
    lostReason?: string;
    assignedAgent?: string;
    lastUpdated?: string;
    avatar?: string;
}

export const STAGES = [
    { id: "new", label: "New" },
    { id: "contacted", label: "Contacted" },
    { id: "appointment", label: "Appointment Booked" },
    { id: "converted", label: "Converted" },
];

export const mockLeadsProgress: LeadProgress[] = [
    {
        id: 1,
        name: "John Doe",
        leadId: "LD-001",
        stages: ["New", "Contacted"],
        currentStage: "Contacted",
        lost: false,
        assignedAgent: "Sarah Wilson",
        lastUpdated: "2023-10-25",
    },
    {
        id: 2,
        name: "Jane Smith",
        leadId: "LD-002",
        stages: ["New", "Contacted"],
        currentStage: "Contacted",
        lost: true,
        lostReason: "No answer after 3 attempts",
        assignedAgent: "Mike Johnson",
        lastUpdated: "2023-10-24",
    },
    {
        id: 3,
        name: "Robert Brown",
        leadId: "LD-003",
        stages: ["New", "Contacted", "Appointment Booked"],
        currentStage: "Appointment Booked",
        lost: false,
        assignedAgent: "Sarah Wilson",
        lastUpdated: "2023-10-26",
    },
    {
        id: 4,
        name: "Emily Davis",
        leadId: "LD-004",
        stages: ["New"],
        currentStage: "New",
        lost: false,
        assignedAgent: "Pending",
        lastUpdated: "2023-10-27",
    },
    {
        id: 5,
        name: "Michael Wilson",
        leadId: "LD-005",
        stages: ["New", "Contacted", "Appointment Booked", "Converted"],
        currentStage: "Converted",
        lost: false,
        assignedAgent: "Mike Johnson",
        lastUpdated: "2023-10-20",
    },
    {
        id: 6,
        name: "Lisa Anderson",
        leadId: "LD-006",
        stages: ["New", "Contacted"],
        currentStage: "Contacted",
        lost: true,
        lostReason: "Not interested in current services",
        assignedAgent: "Sarah Wilson",
        lastUpdated: "2023-10-23",
    },
    {
        id: 7,
        name: "James Taylor",
        leadId: "LD-007",
        stages: ["New", "Contacted", "Appointment Booked"],
        currentStage: "Appointment Booked",
        lost: false,
        assignedAgent: "David Miller",
        lastUpdated: "2023-10-26",
    },
    {
        id: 8,
        name: "William Thomas",
        leadId: "LD-008",
        stages: ["New"],
        currentStage: "New",
        lost: true,
        lostReason: "Invalid contact info",
        assignedAgent: "Pending",
        lastUpdated: "2023-10-22",
    }
];
