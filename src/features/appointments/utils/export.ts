import { Appointment } from "../types";
import { exportToPDF, exportToExcel, exportToCSV } from "@/src/shared/lib/export";

export function exportAppointmentsToPDF(appointments: Appointment[], filename?: string) {
  const headers = ['Date', 'Time', 'Patient', 'Doctor', 'Type', 'Status'];
  const data = appointments.map(apt => [
    new Date(apt.date).toLocaleDateString(),
    new Date(apt.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    apt.patientName,
    apt.doctor,
    apt.type,
    apt.status
  ]);

  const title = 'Appointments Report';
  const file = filename || `appointments-${new Date().toISOString().split('T')[0]}.pdf`;
  
  exportToPDF(title, headers, data, file);
}

export function exportAppointmentsToExcel(appointments: Appointment[], filename?: string) {
  const data = appointments.map(apt => ({
    Date: new Date(apt.date).toLocaleDateString(),
    Time: new Date(apt.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    Patient: apt.patientName,
    Doctor: apt.doctor,
    Type: apt.type,
    Status: apt.status,
    Notes: apt.notes || ''
  }));

  const file = filename || `appointments-${new Date().toISOString().split('T')[0]}.xlsx`;
  
  exportToExcel(data, file, 'Appointments');
}

export function exportAppointmentsToCSV(appointments: Appointment[], filename?: string) {
  const data = appointments.map(apt => ({
    Date: new Date(apt.date).toLocaleDateString(),
    Time: new Date(apt.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    Patient: apt.patientName,
    Doctor: apt.doctor,
    Type: apt.type,
    Status: apt.status,
    Notes: apt.notes || ''
  }));

  const file = filename || `appointments-${new Date().toISOString().split('T')[0]}.csv`;
  
  exportToCSV(data, file);
}

