import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export function exportToPDF(
  title: string,
  headers: string[],
  data: any[][],
  filename: string = 'export.pdf'
) {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
  
  autoTable(doc, {
    head: [headers],
    body: data,
    startY: 35,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [59, 130, 246] },
  });
  
  doc.save(filename);
}

export function exportComprehensivePDF(
  reportData: any,
  filename: string = 'comprehensive-report.pdf'
) {
  const doc = new jsPDF();
  let yPos = 20;
  
  doc.setFontSize(20);
  doc.setTextColor(30, 58, 138);
  doc.text('Comprehensive Business Report', 14, yPos);
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, yPos);
  
  yPos += 15;
  doc.setDrawColor(200, 200, 200);
  doc.line(14, yPos, 196, yPos);
  
  yPos += 10;
  doc.setFontSize(16);
  doc.setTextColor(30, 58, 138);
  doc.text('Key Performance Indicators', 14, yPos);
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  const kpiData = [
    ['Lead Conversion Rate', `${reportData.kpi.leadConversionRate}%`],
    ['Total Appointments', reportData.kpi.totalAppointments.toString()],
    ['No-Show Rate', `${reportData.kpi.noShowRate}%`],
    ['Total Revenue', `$${reportData.kpi.totalRevenue.toLocaleString()}`],
    ['Revenue Growth', `${reportData.kpi.revenueGrowth}%`],
  ];
  
  autoTable(doc, {
    startY: yPos,
    head: [['Metric', 'Value']],
    body: kpiData,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 10 },
    columnStyles: { 0: { cellWidth: 120 }, 1: { cellWidth: 60 } },
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 15;
  
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setFontSize(16);
  doc.setTextColor(30, 58, 138);
  doc.text('Revenue Trend (Last 6 Months)', 14, yPos);
  
  yPos += 8;
  const revenueData = reportData.charts.revenue.map((item: any) => [
    item.name,
    `$${item.value.toLocaleString()}`
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Month', 'Revenue']],
    body: revenueData,
    theme: 'striped',
    headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 10 },
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 15;
  
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setFontSize(16);
  doc.setTextColor(30, 58, 138);
  doc.text('Weekly Appointments', 14, yPos);
  
  yPos += 8;
  const appointmentsData = reportData.charts.appointments.map((item: any) => [
    item.name,
    item.value.toString()
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Day', 'Appointments']],
    body: appointmentsData,
    theme: 'striped',
    headStyles: { fillColor: [139, 92, 246], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 10 },
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 15;
  
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setFontSize(16);
  doc.setTextColor(30, 58, 138);
  doc.text('Lead Sources Distribution', 14, yPos);
  
  yPos += 8;
  const leadSourcesData = reportData.charts.leadSources.map((item: any) => [
    item.name,
    item.value.toString(),
    `${((item.value / reportData.charts.leadSources.reduce((sum: number, s: any) => sum + s.value, 0)) * 100).toFixed(1)}%`
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Source', 'Count', 'Percentage']],
    body: leadSourcesData,
    theme: 'striped',
    headStyles: { fillColor: [245, 158, 11], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 10 },
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 15;
  
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setFontSize(16);
  doc.setTextColor(30, 58, 138);
  doc.text('Recent Activity & Transactions', 14, yPos);
  
  yPos += 8;
  const transactionHeaders = ['Date', 'Type', 'Description', 'Amount', 'Status'];
  const transactionData = reportData.table.map((row: any) => [
    row.date,
    row.type,
    row.description || '-',
    row.amount > 0 ? `$${row.amount}` : '-',
    row.status
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [transactionHeaders],
    body: transactionData,
    theme: 'striped',
    headStyles: { fillColor: [30, 58, 138], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 30 },
      2: { cellWidth: 70 },
      3: { cellWidth: 25 },
      4: { cellWidth: 30 }
    },
  });
  
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  doc.save(filename);
}

export function exportToExcel(
  data: any[],
  filename: string = 'export.xlsx',
  sheetName: string = 'Sheet1'
) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  XLSX.writeFile(workbook, filename);
}

export function exportComprehensiveExcel(
  reportData: any,
  filename: string = 'comprehensive-report.xlsx'
) {
  const workbook = XLSX.utils.book_new();
  const totalLeads = reportData.charts.leadSources.reduce((sum: number, item: any) => sum + item.value, 0);
  
  let rowIndex = 0;
  const reportDataArray: any[][] = [];
  
  reportDataArray[rowIndex++] = ['Comprehensive Business Report', '', '', '', ''];
  reportDataArray[rowIndex++] = ['Generated on', new Date().toLocaleString(), '', '', ''];
  reportDataArray[rowIndex++] = [''];
  
  reportDataArray[rowIndex++] = ['Key Performance Indicators', '', '', '', ''];
  reportDataArray[rowIndex++] = ['Metric', 'Value', '', '', ''];
  reportDataArray[rowIndex++] = ['Lead Conversion Rate', `${reportData.kpi.leadConversionRate}%`, '', '', ''];
  reportDataArray[rowIndex++] = ['Total Appointments', reportData.kpi.totalAppointments, '', '', ''];
  reportDataArray[rowIndex++] = ['No-Show Rate', `${reportData.kpi.noShowRate}%`, '', '', ''];
  reportDataArray[rowIndex++] = ['Total Revenue', reportData.kpi.totalRevenue, '', '', ''];
  reportDataArray[rowIndex++] = ['Revenue Growth', `${reportData.kpi.revenueGrowth}%`, '', '', ''];
  reportDataArray[rowIndex++] = [''];
  
  reportDataArray[rowIndex++] = ['Revenue Trend (Last 6 Months)', '', '', '', ''];
  reportDataArray[rowIndex++] = ['Month', 'Revenue ($)', '', '', ''];
  reportData.charts.revenue.forEach((item: any) => {
    reportDataArray[rowIndex++] = [item.name, item.value, '', '', ''];
  });
  reportDataArray[rowIndex++] = [''];
  
  reportDataArray[rowIndex++] = ['Weekly Appointments', '', '', '', ''];
  reportDataArray[rowIndex++] = ['Day', 'Appointments', '', '', ''];
  reportData.charts.appointments.forEach((item: any) => {
    reportDataArray[rowIndex++] = [item.name, item.value, '', '', ''];
  });
  reportDataArray[rowIndex++] = [''];
  reportDataArray[rowIndex++] = ['Lead Sources Distribution', '', '', '', ''];
  reportDataArray[rowIndex++] = ['Source', 'Count', 'Percentage', '', ''];
  reportData.charts.leadSources.forEach((item: any) => {
    const percentage = totalLeads > 0 ? ((item.value / totalLeads) * 100).toFixed(1) : '0.0';
    reportDataArray[rowIndex++] = [item.name, item.value, `${percentage}%`, '', ''];
  });
  reportDataArray[rowIndex++] = [''];
  
  reportDataArray[rowIndex++] = ['Recent Activity & Transactions', '', '', '', ''];
  reportDataArray[rowIndex++] = ['Date', 'Type', 'Description', 'Amount ($)', 'Status'];
  reportData.table.forEach((row: any) => {
    reportDataArray[rowIndex++] = [
      row.date,
      row.type,
      row.description || '-',
      row.amount || 0,
      row.status
    ];
  });
  
  const mainSheet = XLSX.utils.aoa_to_sheet(reportDataArray);
  
  if (!mainSheet['!merges']) mainSheet['!merges'] = [];
  mainSheet['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } });
  mainSheet['!merges'].push({ s: { r: 3, c: 0 }, e: { r: 3, c: 4 } });
  mainSheet['!merges'].push({ s: { r: 12, c: 0 }, e: { r: 12, c: 4 } });
  mainSheet['!merges'].push({ s: { r: 21, c: 0 }, e: { r: 21, c: 4 } });
  mainSheet['!merges'].push({ s: { r: 30, c: 0 }, e: { r: 30, c: 4 } });
  mainSheet['!merges'].push({ s: { r: 38, c: 0 }, e: { r: 38, c: 4 } });
  
  if (!mainSheet['!cols']) mainSheet['!cols'] = [];
  mainSheet['!cols'][0] = { wch: 30 };
  mainSheet['!cols'][1] = { wch: 20 };
  mainSheet['!cols'][2] = { wch: 15 };
  mainSheet['!cols'][3] = { wch: 15 };
  mainSheet['!cols'][4] = { wch: 15 };
  
  XLSX.utils.book_append_sheet(workbook, mainSheet, 'Report');
  
  const kpiData = [
    ['Key Performance Indicators', ''],
    ['Generated on', new Date().toLocaleString()],
    [''],
    ['Metric', 'Value'],
    ['Lead Conversion Rate', `${reportData.kpi.leadConversionRate}%`],
    ['Total Appointments', reportData.kpi.totalAppointments],
    ['No-Show Rate', `${reportData.kpi.noShowRate}%`],
    ['Total Revenue', reportData.kpi.totalRevenue],
    ['Revenue Growth', `${reportData.kpi.revenueGrowth}%`],
    [''],
    ['Analysis', ''],
    ['Average Revenue per Appointment', (reportData.kpi.totalRevenue / reportData.kpi.totalAppointments).toFixed(2)],
    ['Conversion Efficiency', ((reportData.kpi.leadConversionRate / 100) * reportData.kpi.totalAppointments).toFixed(0)],
  ];
  
  const kpiSheet = XLSX.utils.aoa_to_sheet(kpiData);
  if (!kpiSheet['!cols']) kpiSheet['!cols'] = [];
  kpiSheet['!cols'][0] = { wch: 35 };
  kpiSheet['!cols'][1] = { wch: 25 };
  if (!kpiSheet['!merges']) kpiSheet['!merges'] = [];
  kpiSheet['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } });
  kpiSheet['!merges'].push({ s: { r: 10, c: 0 }, e: { r: 10, c: 1 } });
  XLSX.utils.book_append_sheet(workbook, kpiSheet, 'KPIs');
  
  const revenueData = [
    ['Revenue Trend (Last 6 Months)', ''],
    ['Month', 'Revenue ($)', 'Growth (%)'],
    ...reportData.charts.revenue.map((item: any, index: number) => {
      const prevValue = index > 0 ? reportData.charts.revenue[index - 1].value : item.value;
      const growth = prevValue > 0 ? ((item.value - prevValue) / prevValue * 100) : 0;
      return [item.name, item.value, growth.toFixed(1)];
    }),
    [''],
    ['Total Revenue', reportData.charts.revenue.reduce((sum: number, item: any) => sum + item.value, 0)],
    ['Average Monthly Revenue', (reportData.charts.revenue.reduce((sum: number, item: any) => sum + item.value, 0) / reportData.charts.revenue.length).toFixed(2)],
  ];
  
  const revenueSheet = XLSX.utils.aoa_to_sheet(revenueData);
  if (!revenueSheet['!cols']) revenueSheet['!cols'] = [];
  revenueSheet['!cols'][0] = { wch: 15 };
  revenueSheet['!cols'][1] = { wch: 15 };
  revenueSheet['!cols'][2] = { wch: 12 };
  if (!revenueSheet['!merges']) revenueSheet['!merges'] = [];
  revenueSheet['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } });
  XLSX.utils.book_append_sheet(workbook, revenueSheet, 'Revenue Trend');
  
  const appointmentsData = [
    ['Weekly Appointments', ''],
    ['Day', 'Appointments', 'Percentage of Week'],
    ...reportData.charts.appointments.map((item: any) => {
      const total = reportData.charts.appointments.reduce((sum: number, a: any) => sum + a.value, 0);
      const percentage = total > 0 ? ((item.value / total) * 100) : 0;
      return [item.name, item.value, percentage.toFixed(1)];
    }),
    [''],
    ['Total Weekly Appointments', reportData.charts.appointments.reduce((sum: number, item: any) => sum + item.value, 0)],
    ['Average Daily Appointments', (reportData.charts.appointments.reduce((sum: number, item: any) => sum + item.value, 0) / reportData.charts.appointments.length).toFixed(1)],
  ];
  
  const appointmentsSheet = XLSX.utils.aoa_to_sheet(appointmentsData);
  if (!appointmentsSheet['!cols']) appointmentsSheet['!cols'] = [];
  appointmentsSheet['!cols'][0] = { wch: 15 };
  appointmentsSheet['!cols'][1] = { wch: 15 };
  appointmentsSheet['!cols'][2] = { wch: 18 };
  if (!appointmentsSheet['!merges']) appointmentsSheet['!merges'] = [];
  appointmentsSheet['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } });
  XLSX.utils.book_append_sheet(workbook, appointmentsSheet, 'Appointments');
  
  const leadSourcesData = [
    ['Lead Sources Distribution', ''],
    ['Source', 'Count', 'Percentage', 'Estimated Value'],
    ...reportData.charts.leadSources.map((item: any) => {
      const percentage = totalLeads > 0 ? ((item.value / totalLeads) * 100) : 0;
      const estimatedValue = totalLeads > 0 ? Math.round((item.value / totalLeads) * reportData.kpi.totalRevenue) : 0;
      return [item.name, item.value, percentage.toFixed(1), estimatedValue];
    }),
    [''],
    ['Total Leads', totalLeads],
    ['Average Leads per Source', (totalLeads / reportData.charts.leadSources.length).toFixed(1)],
    ['Top Performing Source', reportData.charts.leadSources.reduce((max: any, item: any) => item.value > (max?.value || 0) ? item : max, null)?.name || 'N/A'],
  ];
  
  const leadSourcesSheet = XLSX.utils.aoa_to_sheet(leadSourcesData);
  if (!leadSourcesSheet['!cols']) leadSourcesSheet['!cols'] = [];
  leadSourcesSheet['!cols'][0] = { wch: 20 };
  leadSourcesSheet['!cols'][1] = { wch: 12 };
  leadSourcesSheet['!cols'][2] = { wch: 12 };
  leadSourcesSheet['!cols'][3] = { wch: 15 };
  if (!leadSourcesSheet['!merges']) leadSourcesSheet['!merges'] = [];
  leadSourcesSheet['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } });
  XLSX.utils.book_append_sheet(workbook, leadSourcesSheet, 'Lead Sources');
  
  const transactionsData = [
    ['Recent Activity & Transactions', ''],
    ['Date', 'Type', 'Description', 'Amount ($)', 'Status'],
    ...reportData.table.map((row: any) => [
      row.date,
      row.type,
      row.description || '-',
      row.amount || 0,
      row.status
    ]),
    [''],
    ['Summary', ''],
    ['Total Transactions', reportData.table.length],
    ['Total Revenue from Transactions', reportData.table.reduce((sum: number, row: any) => sum + (row.amount || 0), 0)],
    ['Completed Transactions', reportData.table.filter((row: any) => row.status === 'Completed').length],
    ['Pending Transactions', reportData.table.filter((row: any) => row.status === 'Pending').length],
  ];
  
  const transactionsSheet = XLSX.utils.aoa_to_sheet(transactionsData);
  if (!transactionsSheet['!cols']) transactionsSheet['!cols'] = [];
  transactionsSheet['!cols'][0] = { wch: 12 };
  transactionsSheet['!cols'][1] = { wch: 12 };
  transactionsSheet['!cols'][2] = { wch: 40 };
  transactionsSheet['!cols'][3] = { wch: 12 };
  transactionsSheet['!cols'][4] = { wch: 12 };
  if (!transactionsSheet['!merges']) transactionsSheet['!merges'] = [];
  transactionsSheet['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } });
  transactionsSheet['!merges'].push({ s: { r: reportData.table.length + 3, c: 0 }, e: { r: reportData.table.length + 3, c: 4 } });
  XLSX.utils.book_append_sheet(workbook, transactionsSheet, 'Transactions');
  
  const summaryData = [
    ['Executive Summary', ''],
    ['Report Generated', new Date().toLocaleString()],
    [''],
    ['Overall Performance', ''],
    ['Lead Conversion Rate', `${reportData.kpi.leadConversionRate}%`],
    ['Total Appointments', reportData.kpi.totalAppointments],
    ['No-Show Rate', `${reportData.kpi.noShowRate}%`],
    ['Total Revenue', reportData.kpi.totalRevenue],
    ['Revenue Growth', `${reportData.kpi.revenueGrowth}%`],
    [''],
    ['Key Insights', ''],
    ['Average Revenue per Appointment', (reportData.kpi.totalRevenue / reportData.kpi.totalAppointments).toFixed(2)],
    ['Best Performing Day', reportData.charts.appointments.reduce((max: any, item: any) => item.value > (max?.value || 0) ? item : max, null)?.name || 'N/A'],
    ['Top Lead Source', reportData.charts.leadSources.reduce((max: any, item: any) => item.value > (max?.value || 0) ? item : max, null)?.name || 'N/A'],
    ['Best Revenue Month', reportData.charts.revenue.reduce((max: any, item: any) => item.value > (max?.value || 0) ? item : max, null)?.name || 'N/A'],
  ];
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  if (!summarySheet['!cols']) summarySheet['!cols'] = [];
  summarySheet['!cols'][0] = { wch: 35 };
  summarySheet['!cols'][1] = { wch: 25 };
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
  
  XLSX.writeFile(workbook, filename);
}

export function exportToCSV(
  data: any[],
  filename: string = 'export.csv'
) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportComprehensiveCSV(
  reportData: any,
  filename: string = 'comprehensive-report.csv'
) {
  const csvRows: string[] = [];
  
  csvRows.push('Comprehensive Business Report');
  csvRows.push(`Generated on: ${new Date().toLocaleString()}`);
  csvRows.push('');
  csvRows.push('KEY PERFORMANCE INDICATORS');
  csvRows.push('Metric,Value');
  csvRows.push(`Lead Conversion Rate,${reportData.kpi.leadConversionRate}%`);
  csvRows.push(`Total Appointments,${reportData.kpi.totalAppointments}`);
  csvRows.push(`No-Show Rate,${reportData.kpi.noShowRate}%`);
  csvRows.push(`Total Revenue,$${reportData.kpi.totalRevenue.toLocaleString()}`);
  csvRows.push(`Revenue Growth,${reportData.kpi.revenueGrowth}%`);
  csvRows.push('');
  csvRows.push('REVENUE TREND (Last 6 Months)');
  csvRows.push('Month,Revenue ($),Growth (%)');
  reportData.charts.revenue.forEach((item: any, index: number) => {
    const prevValue = index > 0 ? reportData.charts.revenue[index - 1].value : item.value;
    const growth = prevValue > 0 ? ((item.value - prevValue) / prevValue * 100).toFixed(1) : '0.0';
    csvRows.push(`${item.name},${item.value},${growth}%`);
  });
  csvRows.push('');
  csvRows.push('WEEKLY APPOINTMENTS');
  csvRows.push('Day,Appointments,Percentage');
  const totalAppointments = reportData.charts.appointments.reduce((sum: number, item: any) => sum + item.value, 0);
  reportData.charts.appointments.forEach((item: any) => {
    const percentage = totalAppointments > 0 ? ((item.value / totalAppointments) * 100).toFixed(1) : '0.0';
    csvRows.push(`${item.name},${item.value},${percentage}%`);
  });
  csvRows.push('');
  csvRows.push('LEAD SOURCES DISTRIBUTION');
  csvRows.push('Source,Count,Percentage');
  const totalLeads = reportData.charts.leadSources.reduce((sum: number, item: any) => sum + item.value, 0);
  reportData.charts.leadSources.forEach((item: any) => {
    const percentage = totalLeads > 0 ? ((item.value / totalLeads) * 100).toFixed(1) : '0.0';
    csvRows.push(`${item.name},${item.value},${percentage}%`);
  });
  csvRows.push('');
  csvRows.push('RECENT ACTIVITY & TRANSACTIONS');
  csvRows.push('Date,Type,Description,Amount ($),Status');
  reportData.table.forEach((row: any) => {
    csvRows.push(`${row.date},${row.type},"${row.description || '-'}",${row.amount || 0},${row.status}`);
  });
  csvRows.push('');
  csvRows.push('SUMMARY');
  csvRows.push('Metric,Value');
  csvRows.push(`Total Transactions,${reportData.table.length}`);
  csvRows.push(`Total Revenue from Transactions,$${reportData.table.reduce((sum: number, row: any) => sum + (row.amount || 0), 0).toLocaleString()}`);
  csvRows.push(`Average Revenue per Appointment,$${(reportData.kpi.totalRevenue / reportData.kpi.totalAppointments).toFixed(2)}`);
  csvRows.push(`Best Performing Day,${reportData.charts.appointments.reduce((max: any, item: any) => item.value > (max?.value || 0) ? item : max, null)?.name || 'N/A'}`);
  csvRows.push(`Top Lead Source,${reportData.charts.leadSources.reduce((max: any, item: any) => item.value > (max?.value || 0) ? item : max, null)?.name || 'N/A'}`);
  
  const csv = csvRows.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

