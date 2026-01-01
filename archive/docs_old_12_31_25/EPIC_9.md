Epic 9: Export & Sharing
Priority: P2 | Effort: L | Risk: Medium | Dependencies: Epic 1, Epic 2
User StoryAcceptance CriteriaAs an AE, I want to export a PDF summary so I can share with Finance"Export PDF" generates a clean, branded summary with all metricsAs an AE, I want to screenshot the metrics panel cleanlyPrint styles hide input panels, show only outputs

Epic 9: Export & Sharing
Priority: P2 | Effort: L | Risk: Medium | Dependencies: Epic 1, Epic 2
A) What to Change (Exact)

Add "Export PDF" button that generates a downloadable PDF summary
PDF should include:

Deal name and date
Deal Health status with reasoning
All core metrics (ARR, MRR, TCV, Margin, LTV:CAC, Payback)
Product line items summary
Cash flow chart
Key assumptions (billing, contract length, CAC)


Add "Copy Link" button that copies a shareable URL (if deals have URLs)
Add "Copy to Clipboard" for metrics summary (plain text for Slack/email)
Add print stylesheet that hides input panels, shows only metrics
PDF should have professional branding (DealQuary logo, clean layout)
Option to hide sensitive fields (CAC, margin) in export

B) File/Component Plan
components/
├── export/
│   ├── ExportMenu.tsx              # New: Dropdown with export options
│   ├── PDFExportView.tsx           # New: Print-optimized layout for PDF
│   ├── ExportOptionsModal.tsx      # New: Configure what to include/hide
│   └── ShareLinkModal.tsx          # New: Copy link UI
├── lib/
│   ├── pdfGenerator.ts             # New: PDF generation logic
│   ├── exportFormatters.ts         # New: Format data for various exports
│   └── clipboardExport.ts          # New: Plain text formatter
styles/
│   └── print.css                   # New: Print-specific styles
C) Step-by-Step Implementation Tasks
EPIC 9 TASKS:

1. Create ExportMenu.tsx dropdown:
   - Location: Replace or augment "Upgrade to Export" button in metrics panel
   - Options:
     - "Export PDF" → opens ExportOptionsModal then generates PDF
     - "Copy Summary" → copies plain text to clipboard
     - "Copy Link" → copies shareable URL (if available)
     - "Print" → triggers browser print dialog
   - Styling: Dropdown with icons for each option

2. Create ExportOptionsModal.tsx:
   - Checkboxes for what to include:
     - [ ] Deal Health & Reasoning (default: on)
     - [ ] Core Metrics (ARR, MRR, TCV) (default: on)
     - [ ] Profitability (Margin, Profit) (default: on)
     - [ ] Advanced Metrics (LTV:CAC, Payback) (default: on)
     - [ ] Product Line Items (default: on)
     - [ ] Cash Flow Chart (default: on)
     - [ ] Deal Assumptions (default: on)
   - Sensitive data toggles:
     - [ ] Hide Customer Acquisition Cost (default: off)
     - [ ] Hide Margin % (default: off)
   - "Generate PDF" button
   - "Cancel" button

3. Create PDFExportView.tsx:
   - Hidden component that renders the PDF-ready layout
   - Layout:
 ┌─────────────────────────────────────┐
 │ [Logo]  DEAL SUMMARY     [Date]    │
 │         {Deal Name}                 │
 ├─────────────────────────────────────┤
 │ DEAL HEALTH: ● Strong               │
 │ ✓ Strong 80% margin                 │
 │ ✓ 12-month commitment              │
 │ ⚠ Discount exceeds safety net      │
 ├─────────────────────────────────────┤
 │ CORE METRICS                        │
 │ ┌─────────┬─────────┬─────────┐    │
 │ │ ARR     │ MRR     │ TCV     │    │
 │ │ $12,000 │ $1,000  │ $12,000 │    │
 │ └─────────┴─────────┴─────────┘    │
 ├─────────────────────────────────────┤
 │ PROFITABILITY                       │
 │ ┌─────────┬─────────┬─────────┐    │
 │ │ Margin  │ Monthly │ Annual  │    │
 │ │ 80%     │ $800    │ $9,600  │    │
 │ └─────────┴─────────┴─────────┘    │
 ├─────────────────────────────────────┤
 │ PRODUCTS                            │
 │ 1. Product Name - $10 × 100 = $1K  │
 ├─────────────────────────────────────┤
 │ CASH FLOW TO BREAK-EVEN            │
 │ [Chart Image]                       │
 │ Break-even: Month 7                 │
 ├─────────────────────────────────────┤
 │ ASSUMPTIONS                         │
 │ Billing: Monthly | Term: 12 mo     │
 │ CAC: $5,000 | Discount: 30%        │
 └─────────────────────────────────────┘
 │ Generated by DealQuary | [Date]    │
 └─────────────────────────────────────┘
   - Use Tailwind print utilities or inline styles
   - Ensure chart is rendered as static image

4. Create pdfGenerator.ts:
   Option A - Use html2pdf.js or jsPDF:
```typescript
   import html2pdf from 'html2pdf.js';
   
   export async function generatePDF(
     element: HTMLElement,
     filename: string
   ): Promise<void> {
     const options = {
       margin: 10,
       filename: `${filename}.pdf`,
       image: { type: 'jpeg', quality: 0.98 },
       html2canvas: { scale: 2 },
       jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
     };
     await html2pdf().set(options).from(element).save();
   }
```
   
   Option B - Use @react-pdf/renderer for more control:
```typescript
   import { Document, Page, Text, View, pdf } from '@react-pdf/renderer';
   // Build PDF programmatically with full control
```

5. Create exportFormatters.ts:
```typescript
   export function formatMetricsForExport(metrics: Metrics, options: ExportOptions): ExportData {
     return {
       dealName: metrics.dealName,
       date: new Date().toLocaleDateString(),
       dealHealth: {
         status: metrics.dealHealth.status,
         strengths: options.includeReasoning ? metrics.dealHealth.strengths : [],
         concerns: options.includeReasoning ? metrics.dealHealth.concerns : []
       },
       coreMetrics: options.includeCoreMetrics ? {
         arr: formatCurrency(metrics.arr),
         mrr: formatCurrency(metrics.mrr),
         tcv: formatCurrency(metrics.tcv)
       } : null,
       // ... etc
     };
   }
```

6. Create clipboardExport.ts:
```typescript
   export function generatePlainTextSummary(metrics: Metrics): string {
     return `
   📊 Deal Summary: ${metrics.dealName}
   
   Deal Health: ${metrics.dealHealth.status}
   
   Core Metrics:
   • ARR: ${formatCurrency(metrics.arr)}
   • MRR: ${formatCurrency(metrics.mrr)}
   • TCV: ${formatCurrency(metrics.tcv)}
   
   Profitability:
   • Net Margin: ${metrics.margin}%
   • Annual Profit: ${formatCurrency(metrics.annualProfit)}
   
   Advanced:
   • LTV:CAC: ${metrics.ltvCac.toFixed(2)}
   • Payback: ${metrics.payback.toFixed(1)} months
   
   Generated by DealQuary
     `.trim();
   }
   
   export async function copyToClipboard(text: string): Promise<boolean> {
     try {
       await navigator.clipboard.writeText(text);
       return true;
     } catch {
       // Fallback for older browsers
       const textarea = document.createElement('textarea');
       textarea.value = text;
       document.body.appendChild(textarea);
       textarea.select();
       document.execCommand('copy');
       document.body.removeChild(textarea);
       return true;
     }
   }
```

7. Create print.css stylesheet:
```css
   @media print {
     /* Hide input panels */
     .deal-inputs,
     .sidebar,
     .navbar,
     .feedback-button,
     .export-menu {
       display: none !important;
     }
     
     /* Show only metrics */
     .deal-metrics-panel {
       position: static !important;
       width: 100% !important;
       max-width: none !important;
       box-shadow: none !important;
       border: none !important;
     }
     
     /* Ensure chart prints properly */
     .cash-flow-chart {
       break-inside: avoid;
       max-height: 300px;
     }
     
     /* Clean backgrounds for printing */
     body {
       background: white !important;
       color: black !important;
     }
     
     .metric-card {
       background: #f5f5f5 !important;
       border: 1px solid #ddd !important;
     }
     
     /* Page breaks */
     .page-break {
       break-after: page;
     }
   }
```

8. Add print stylesheet to app:
   - Import in _app.tsx or layout.tsx
   - Or add to globals.css with @media print block

9. Wire up Export button:
   - Replace "Upgrade to Export" with ExportMenu
   - Or keep "Upgrade to Export" for free tier, show ExportMenu for paid
   - Add loading state during PDF generation
   - Show success toast after export

10. Add shareable link (if applicable):
    - If deals have unique URLs: `/deal/{dealId}`
    - "Copy Link" copies this URL to clipboard
    - Show toast: "Link copied to clipboard"
    - If no URL system exists, skip this feature

11. Handle chart export:
    - Charts (Canvas/SVG) need special handling for PDF
    - Option 1: Use html2canvas to capture chart as image
    - Option 2: Re-render chart in PDF context
    - Ensure chart legend is included
    - Test that chart appears correctly in generated PDF
D) Acceptance Criteria (Testable)

 Export menu dropdown appears when clicking export button
 "Export PDF" option opens configuration modal
 Can toggle which sections to include in PDF
 Can toggle hiding sensitive fields (CAC, margin)
 Generated PDF downloads with deal name in filename
 PDF includes DealQuary logo/branding
 PDF includes current date
 PDF includes all selected metrics with correct values
 PDF includes Cash Flow chart as readable image
 PDF is readable when printed (black text on white background)
 "Copy Summary" copies formatted plain text to clipboard
 Toast notification confirms successful copy
 Pressing Ctrl+P / Cmd+P shows print-optimized view
 Print view hides input panels, shows only metrics
 PDF file size is reasonable (<2MB for typical deal)
 Export works on Chrome, Firefox, Safari

E) Guardrails

PDF generation should not block UI (use async/loading state)
Handle chart rendering failures gracefully (show placeholder if chart fails)
Don't include internal-only data in exports (debug info, internal IDs)
Respect "hide sensitive data" toggles - actually remove data, not just CSS hide
Test PDF output on different screen sizes before finalizing
Ensure exported values match exactly what's shown in UI
Add appropriate file extension (.pdf) automatically
Sanitize deal name for use in filename (remove special characters)
Consider adding watermark for free tier exports (if monetization strategy requires)