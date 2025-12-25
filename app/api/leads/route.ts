import { NextResponse } from "next/server";
import { leads, addLead } from "@/src/shared/services/data-store";
import { LeadStatus } from "@/src/shared/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Get query parameters
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const status = searchParams.get("status") as LeadStatus | null;
  const search = searchParams.get("search")?.toLowerCase() || null;

  let filteredLeads = [...leads];

  if (status) {
    filteredLeads = filteredLeads.filter(lead => lead.status === status);
  }

  if (search) {
    filteredLeads = filteredLeads.filter(lead =>
      lead.name.toLowerCase().includes(search) ||
      lead.phone.includes(search) ||
      (lead.phoneSecondary && lead.phoneSecondary.includes(search))
    );
  }

  // Sort by creation date (newest first)
  filteredLeads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Paginate
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedLeads = filteredLeads.slice(startIndex, endIndex);

  // Return with pagination metadata
  return NextResponse.json({
    leads: paginatedLeads,
    pagination: {
      page,
      limit,
      total: filteredLeads.length,
      totalPages: Math.ceil(filteredLeads.length / limit),
      hasMore: endIndex < filteredLeads.length,
    },
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const newLead = {
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    ...body,
  };
  addLead(newLead);
  return NextResponse.json(newLead);
}