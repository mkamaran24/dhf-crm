import { NextResponse } from "next/server";
import { Journey } from "@/types/journey";

const mockJourneys: Journey[] = [
  {
    id: "1",
    leadId: "1",
    patientId: "p1",
    name: "John Doe",
    email: "john.doe@example.com",
    currentStage: "Active Patient",
    progress: 100,
    createdAt: "2023-10-01T10:00:00Z",
    updatedAt: "2023-11-15T14:30:00Z",
    events: [
      {
        id: "e1",
        date: "2023-10-01T10:00:00Z",
        title: "Lead Created",
        description: "Source: Website Form",
        type: "info",
        icon: "UserPlus"
      },
      {
        id: "e2",
        date: "2023-10-02T14:00:00Z",
        title: "Initial Contact",
        description: "Phone call with sales team. Interested in dental implants.",
        type: "info",
        icon: "Phone"
      },
      {
        id: "e3",
        date: "2023-10-05T09:00:00Z",
        title: "Consultation Scheduled",
        description: "Booked for 2023-10-10",
        type: "success",
        icon: "Calendar"
      },
      {
        id: "e4",
        date: "2023-10-10T11:00:00Z",
        title: "Converted to Patient",
        description: "Signed treatment plan.",
        type: "success",
        icon: "CheckCircle"
      },
      {
        id: "e5",
        date: "2023-11-10T10:00:00Z",
        title: "First Visit Completed",
        description: "Initial assessment and cleaning.",
        type: "success",
        icon: "Stethoscope"
      }
    ]
  },
  {
    id: "2",
    leadId: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    currentStage: "Contacted",
    progress: 25,
    createdAt: "2023-11-01T09:00:00Z",
    updatedAt: "2023-11-02T16:00:00Z",
    events: [
      {
        id: "e6",
        date: "2023-11-01T09:00:00Z",
        title: "Lead Created",
        description: "Source: Referral",
        type: "info",
        icon: "UserPlus"
      }
    ]
  }
];

export async function GET() {
  return NextResponse.json(mockJourneys);
}
