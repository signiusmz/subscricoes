import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFOptions {
  title: string;
  filename: string;
  orientation?: 'portrait' | 'landscape';
  format?: 'a4' | 'letter';
}

export interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  nuit: string;
  logo?: string;
}

export interface ClientInfo {
  companyName: string;
  representative: string;
  email: string;
  phone: string;
  nuit: string;
  address: string;
}

export interface InvoiceData {
  number: string;
  date: string;
  dueDate: string;
  clientInfo: ClientInfo;
  serviceName: string;
  serviceDescription: string;
  amount: number;
  status: string;
  paymentMethod?: string;
  paidDate?: string;
  notes?: string;
}

export interface ReceiptData {
  number: string;
  date: string;
  clientInfo: ClientInfo;
  invoiceNumber: string;
  serviceName: string;
  amount: number;
  paymentMethod: string;
  reference?: string;
  notes?: string;
}

export interface ReportData {
  title: string;
  type: string;
  period: string;
  startDate: string;
  endDate: string;
  totalClients: number;
  totalRevenue: number;
  averageNPS: number;
  data: any[];
}

export class PDFGenerator {
  private static companyInfo: CompanyInfo = {
    name: 'TechSolutions Lda',
    address: 'Av. Julius Nyerere, 123, Maputo',
    phone: '+258 21 123 456',
    email: 'info@techsolutions.mz',
    nuit: '400123456'
  };

  private static addHeader(doc: jsPDF, title: string) {
    // Company logo area (placeholder)
    doc.setFillColor(59, 130, 246); // Blue color
    doc.rect(20, 15, 30, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('LOGO', 35, 27);

    // Company info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(this.companyInfo.name, 60, 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(this.companyInfo.address, 60, 32);
    doc.text(`Tel: ${this.companyInfo.phone}`, 60, 37);
    doc.text(`Email: ${this.companyInfo.email}`, 60, 42);
    doc.text(`NUIT: ${this.companyInfo.nuit}`, 60, 47);

    // Document title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 130, 246);
    doc.text(title, 20, 65);

    // Line separator
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 70, 190, 70);

    return 80; // Return Y position for content
  }

  private static addFooter(doc: jsPDF) {
    const pageHeight = doc.internal.pageSize.height;
    
    // Footer line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, pageHeight - 30, 190, pageHeight - 30);
    
    // Footer text
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Obrigado pela sua preferência!', 20, pageHeight - 20);
    doc.text(`Documento gerado em ${new Date().toLocaleDateString('pt-PT')}`, 20, pageHeight - 15);
    
    // Page number
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(`Página ${i} de ${pageCount}`, 170, pageHeight - 15);
    }
  }

  static generateInvoice(invoiceData: InvoiceData): void {
    const doc = new jsPDF();
    
    // Header
    const startY = this.addHeader(doc, 'FACTURA');
    
    // Invoice details box
    doc.setFillColor(245, 245, 245);
    doc.rect(20, startY, 170, 25, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(20, startY, 170, 25);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('DETALHES DA FACTURA', 25, startY + 8);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Número: ${invoiceData.number}`, 25, startY + 15);
    doc.text(`Data de Emissão: ${new Date(invoiceData.date).toLocaleDateString('pt-PT')}`, 25, startY + 20);
    doc.text(`Data de Vencimento: ${new Date(invoiceData.dueDate).toLocaleDateString('pt-PT')}`, 120, startY + 15);
    doc.text(`Status: ${invoiceData.status.toUpperCase()}`, 120, startY + 20);
    
    // Client info
    let currentY = startY + 35;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DADOS DO CLIENTE', 20, currentY);
    
    currentY += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Empresa: ${invoiceData.clientInfo.companyName}`, 20, currentY);
    doc.text(`Representante: ${invoiceData.clientInfo.representative}`, 20, currentY + 5);
    doc.text(`Email: ${invoiceData.clientInfo.email}`, 20, currentY + 10);
    doc.text(`Telefone: ${invoiceData.clientInfo.phone}`, 20, currentY + 15);
    doc.text(`NUIT: ${invoiceData.clientInfo.nuit}`, 120, currentY);
    doc.text(`Endereço: ${invoiceData.clientInfo.address}`, 20, currentY + 20);
    
    // Service details table
    currentY += 35;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('SERVIÇOS', 20, currentY);
    
    // Table header
    currentY += 10;
    doc.setFillColor(59, 130, 246);
    doc.rect(20, currentY, 170, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Descrição', 25, currentY + 5);
    doc.text('Valor', 160, currentY + 5);
    
    // Table content
    currentY += 8;
    doc.setFillColor(250, 250, 250);
    doc.rect(20, currentY, 170, 15, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(20, currentY, 170, 15);
    
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(invoiceData.serviceName, 25, currentY + 5);
    doc.text(invoiceData.serviceDescription, 25, currentY + 10);
    doc.setFont('helvetica', 'bold');
    doc.text(`${invoiceData.amount.toLocaleString()} MT`, 160, currentY + 8);
    
    // Total
    currentY += 20;
    doc.setFillColor(59, 130, 246);
    doc.rect(120, currentY, 70, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', 125, currentY + 7);
    doc.text(`${invoiceData.amount.toLocaleString()} MT`, 160, currentY + 7);
    
    // Payment info (if paid)
    if (invoiceData.status === 'paid' && invoiceData.paymentMethod && invoiceData.paidDate) {
      currentY += 20;
      doc.setFillColor(34, 197, 94);
      doc.rect(20, currentY, 170, 15, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('PAGAMENTO EFETUADO', 25, currentY + 5);
      doc.setFont('helvetica', 'normal');
      doc.text(`Data: ${new Date(invoiceData.paidDate).toLocaleDateString('pt-PT')}`, 25, currentY + 10);
      doc.text(`Método: ${invoiceData.paymentMethod}`, 120, currentY + 10);
    }
    
    // Notes
    if (invoiceData.notes) {
      currentY += 25;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('OBSERVAÇÕES:', 20, currentY);
      doc.setFont('helvetica', 'normal');
      const splitNotes = doc.splitTextToSize(invoiceData.notes, 170);
      doc.text(splitNotes, 20, currentY + 5);
    }
    
    // Footer
    this.addFooter(doc);
    
    doc.save(`factura-${invoiceData.number}.pdf`);
  }

  static generateReceipt(receiptData: ReceiptData): void {
    const doc = new jsPDF();
    
    // Header
    const startY = this.addHeader(doc, 'RECIBO');
    
    // Receipt details box
    doc.setFillColor(34, 197, 94, 0.1);
    doc.rect(20, startY, 170, 25, 'F');
    doc.setDrawColor(34, 197, 94);
    doc.rect(20, startY, 170, 25);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 197, 94);
    doc.text('DETALHES DO RECIBO', 25, startY + 8);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(`Número: ${receiptData.number}`, 25, startY + 15);
    doc.text(`Data: ${new Date(receiptData.date).toLocaleDateString('pt-PT')}`, 25, startY + 20);
    doc.text(`Factura: ${receiptData.invoiceNumber}`, 120, startY + 15);
    doc.text(`Método: ${receiptData.paymentMethod}`, 120, startY + 20);
    
    // Client info
    let currentY = startY + 35;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DADOS DO CLIENTE', 20, currentY);
    
    currentY += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Empresa: ${receiptData.clientInfo.companyName}`, 20, currentY);
    doc.text(`Representante: ${receiptData.clientInfo.representative}`, 20, currentY + 5);
    doc.text(`Email: ${receiptData.clientInfo.email}`, 20, currentY + 10);
    doc.text(`NUIT: ${receiptData.clientInfo.nuit}`, 120, currentY);
    
    // Payment details
    currentY += 25;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DETALHES DO PAGAMENTO', 20, currentY);
    
    // Payment table
    currentY += 10;
    doc.setFillColor(34, 197, 94);
    doc.rect(20, currentY, 170, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Serviço', 25, currentY + 5);
    doc.text('Valor Pago', 150, currentY + 5);
    
    currentY += 8;
    doc.setFillColor(240, 253, 244);
    doc.rect(20, currentY, 170, 12, 'F');
    doc.setDrawColor(34, 197, 94);
    doc.rect(20, currentY, 170, 12);
    
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(receiptData.serviceName, 25, currentY + 8);
    doc.setFont('helvetica', 'bold');
    doc.text(`${receiptData.amount.toLocaleString()} MT`, 150, currentY + 8);
    
    // Reference (if exists)
    if (receiptData.reference) {
      currentY += 20;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('REFERÊNCIA:', 20, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(receiptData.reference, 60, currentY);
    }
    
    // Notes
    if (receiptData.notes) {
      currentY += 15;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('OBSERVAÇÕES:', 20, currentY);
      doc.setFont('helvetica', 'normal');
      const splitNotes = doc.splitTextToSize(receiptData.notes, 170);
      doc.text(splitNotes, 20, currentY + 5);
    }
    
    // Confirmation box
    currentY += 30;
    doc.setFillColor(34, 197, 94, 0.1);
    doc.rect(20, currentY, 170, 20, 'F');
    doc.setDrawColor(34, 197, 94);
    doc.rect(20, currentY, 170, 20);
    
    doc.setTextColor(34, 197, 94);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('✓ PAGAMENTO CONFIRMADO', 25, currentY + 8);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(`Valor total de ${receiptData.amount.toLocaleString()} MT recebido com sucesso.`, 25, currentY + 15);
    
    // Footer
    this.addFooter(doc);
    
    doc.save(`recibo-${receiptData.number}.pdf`);
  }

  static generateClientStatement(clientData: ClientInfo, invoices: any[]): void {
    const doc = new jsPDF();
    
    // Header
    const startY = this.addHeader(doc, 'EXTRATO DA CONTA');
    
    // Period info
    doc.setFillColor(245, 245, 245);
    doc.rect(20, startY, 170, 15, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(20, startY, 170, 15);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('PERÍODO DO EXTRATO', 25, startY + 5);
    doc.setFont('helvetica', 'normal');
    doc.text(`De: ${new Date().getFullYear()}-01-01 até ${new Date().toISOString().split('T')[0]}`, 25, startY + 10);
    
    // Client info
    let currentY = startY + 25;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DADOS DO CLIENTE', 20, currentY);
    
    currentY += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Empresa: ${clientData.companyName}`, 20, currentY);
    doc.text(`NUIT: ${clientData.nuit}`, 120, currentY);
    doc.text(`Email: ${clientData.email}`, 20, currentY + 5);
    doc.text(`Telefone: ${clientData.phone}`, 120, currentY + 5);
    
    // Summary
    currentY += 20;
    const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const paidAmount = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
    const pendingAmount = totalAmount - paidAmount;
    
    doc.setFillColor(59, 130, 246, 0.1);
    doc.rect(20, currentY, 170, 20, 'F');
    doc.setDrawColor(59, 130, 246);
    doc.rect(20, currentY, 170, 20);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('RESUMO DA CONTA', 25, currentY + 6);
    doc.setFontSize(10);
    doc.text(`Total Faturado: ${totalAmount.toLocaleString()} MT`, 25, currentY + 12);
    doc.text(`Total Pago: ${paidAmount.toLocaleString()} MT`, 25, currentY + 16);
    doc.text(`Saldo Pendente: ${pendingAmount.toLocaleString()} MT`, 120, currentY + 12);
    doc.text(`Nº de Faturas: ${invoices.length}`, 120, currentY + 16);
    
    // Invoices table
    currentY += 30;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('HISTÓRICO DE FATURAS', 20, currentY);
    
    // Table header
    currentY += 10;
    doc.setFillColor(59, 130, 246);
    doc.rect(20, currentY, 170, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Número', 25, currentY + 5);
    doc.text('Data', 60, currentY + 5);
    doc.text('Serviço', 90, currentY + 5);
    doc.text('Valor', 140, currentY + 5);
    doc.text('Status', 165, currentY + 5);
    
    // Table content
    currentY += 8;
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    
    invoices.forEach((invoice, index) => {
      if (currentY > 250) { // New page if needed
        doc.addPage();
        currentY = 30;
      }
      
      const bgColor = index % 2 === 0 ? [250, 250, 250] : [255, 255, 255];
      doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
      doc.rect(20, currentY, 170, 8, 'F');
      
      doc.text(invoice.number, 25, currentY + 5);
      doc.text(new Date(invoice.date).toLocaleDateString('pt-PT'), 60, currentY + 5);
      doc.text(invoice.serviceName.substring(0, 20), 90, currentY + 5);
      doc.text(`${invoice.amount.toLocaleString()} MT`, 140, currentY + 5);
      
      // Status with color
      if (invoice.status === 'paid') {
        doc.setTextColor(34, 197, 94);
        doc.text('Paga', 165, currentY + 5);
      } else if (invoice.status === 'pending') {
        doc.setTextColor(234, 179, 8);
        doc.text('Pendente', 165, currentY + 5);
      } else {
        doc.setTextColor(239, 68, 68);
        doc.text('Atrasada', 165, currentY + 5);
      }
      doc.setTextColor(0, 0, 0);
      
      currentY += 8;
    });
    
    // Footer
    this.addFooter(doc);
    
    doc.save(`extrato-${clientData.companyName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  }

  static generateReport(reportData: ReportData): void {
    const doc = new jsPDF();
    
    // Header
    const startY = this.addHeader(doc, reportData.title.toUpperCase());
    
    // Report info
    doc.setFillColor(245, 245, 245);
    doc.rect(20, startY, 170, 20, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(20, startY, 170, 20);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMAÇÕES DO RELATÓRIO', 25, startY + 6);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Período: ${reportData.startDate} - ${reportData.endDate}`, 25, startY + 12);
    doc.text(`Tipo: ${reportData.type}`, 25, startY + 16);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-PT')}`, 120, startY + 12);
    
    // Summary metrics
    let currentY = startY + 30;
    doc.setFillColor(59, 130, 246, 0.1);
    doc.rect(20, currentY, 170, 25, 'F');
    doc.setDrawColor(59, 130, 246);
    doc.rect(20, currentY, 170, 25);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('RESUMO EXECUTIVO', 25, currentY + 8);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total de Clientes: ${reportData.totalClients}`, 25, currentY + 15);
    doc.text(`Receita Total: ${reportData.totalRevenue.toLocaleString()} MT`, 25, currentY + 20);
    doc.text(`NPS Médio: ${reportData.averageNPS}`, 120, currentY + 15);
    doc.text(`Período: ${reportData.period}`, 120, currentY + 20);
    
    // Data table
    if (reportData.data && reportData.data.length > 0) {
      currentY += 35;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('DADOS DETALHADOS', 20, currentY);
      
      // Table header
      currentY += 10;
      doc.setFillColor(59, 130, 246);
      doc.rect(20, currentY, 170, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('Período', 25, currentY + 5);
      doc.text('Receita', 70, currentY + 5);
      doc.text('Clientes', 110, currentY + 5);
      doc.text('Serviços', 140, currentY + 5);
      doc.text('NPS', 170, currentY + 5);
      
      // Table content
      currentY += 8;
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      
      reportData.data.forEach((item, index) => {
        if (currentY > 250) { // New page if needed
          doc.addPage();
          currentY = 30;
        }
        
        const bgColor = index % 2 === 0 ? [250, 250, 250] : [255, 255, 255];
        doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
        doc.rect(20, currentY, 170, 8, 'F');
        
        doc.text(item.period || `Item ${index + 1}`, 25, currentY + 5);
        doc.text(`${(item.revenue || 0).toLocaleString()}`, 70, currentY + 5);
        doc.text(`${item.clients || 0}`, 110, currentY + 5);
        doc.text(`${item.services || 0}`, 140, currentY + 5);
        doc.text(`${item.nps || 0}`, 170, currentY + 5);
        
        currentY += 8;
      });
    }
    
    // Footer
    this.addFooter(doc);
    
    doc.save(`relatorio-${reportData.type}-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  // Generate PDF from HTML element
  static async fromElement(element: HTMLElement, options: PDFOptions): Promise<void> {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: options.orientation || 'portrait',
      unit: 'mm',
      format: options.format || 'a4'
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(options.filename);
  }
}