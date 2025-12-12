
import { NextResponse } from 'next/server';

export async function GET() {
  // Mock Analytics Data
  const data = {
    kpi: {
      leadConversionRate: 18.5, // %
      totalAppointments: 142,
      noShowRate: 4.2, // %
      totalRevenue: 45200, // $
      revenueGrowth: 12.5, // %
    },
    charts: {
      appointments: [
        { name: 'Mon', value: 12 },
        { name: 'Tue', value: 18 },
        { name: 'Wed', value: 15 },
        { name: 'Thu', value: 22 },
        { name: 'Fri', value: 20 },
        { name: 'Sat', value: 14 },
        { name: 'Sun', value: 5 },
      ],
      leadSources: [
        { name: 'Facebook', value: 35 },
        { name: 'Google Ads', value: 45 },
        { name: 'Referral', value: 15 },
        { name: 'Other', value: 5 },
      ],
      revenue: [
        { name: 'Jan', value: 12000 },
        { name: 'Feb', value: 19000 },
        { name: 'Mar', value: 15000 },
        { name: 'Apr', value: 22000 },
        { name: 'May', value: 28000 },
        { name: 'Jun', value: 32000 },
      ]
    },
    table: [
      { id: 1, type: 'Payment', date: '2025-12-11', description: 'Consultation Fee - John Doe', amount: 150, status: 'Completed' },
      { id: 2, type: 'Lead', date: '2025-12-11', description: 'New Lead via Website', amount: 0, status: 'New' },
      { id: 3, type: 'Payment', date: '2025-12-10', description: 'Root Canal Deposit - Sarah Smith', amount: 500, status: 'Pending' },
      { id: 4, type: 'No-Show', date: '2025-12-09', description: 'Missed Appointment - Mike Ross', amount: 0, status: 'Void' },
      { id: 5, type: 'Payment', date: '2025-12-09', description: 'Teeth Cleaning - Rachel Zane', amount: 120, status: 'Completed' },
    ]
  };

  return NextResponse.json(data);
}
