"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import type { Deal } from "@/lib/validators";
import type { DealTotals } from "@/lib/calc";
import { generatePlainTextSummary, copyToClipboard } from "@/lib/clipboardExport";
import { getSubscriptionStatus } from "@/lib/subscription";
import { UpgradeModal } from "@/components/modals/UpgradeModal";
import * as XLSX from "xlsx";
import { money } from "@/lib/format";

type ExportMenuProps = {
  deal: Deal;
  totals: DealTotals;
};

export default function ExportMenu({ deal, totals }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Get user session and subscription status
  const { data: session } = useSession();
  const { isPro, isFree } = getSubscriptionStatus(session);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const showSuccessToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCopySummary = async () => {
    // Check if user is not signed in
    if (!session) {
      setIsOpen(false);
      setShowUpgradeModal(true);
      return;
    }

    // Check subscription before allowing copy
    if (isFree) {
      setIsOpen(false);
      setShowUpgradeModal(true);
      return;
    }

    const summary = generatePlainTextSummary(deal, totals);
    const success = await copyToClipboard(summary);
    if (success) {
      showSuccessToast("✓ Summary copied to clipboard!");
    } else {
      showSuccessToast("✗ Failed to copy to clipboard");
    }
    setIsOpen(false);
  };

  const handleExportExcel = () => {
    // Check if user is not signed in
    if (!session) {
      setIsOpen(false);
      setShowUpgradeModal(true);
      return;
    }

    // Check subscription before allowing Excel export
    if (isFree) {
      setIsOpen(false);
      setShowUpgradeModal(true);
      return;
    }

    try {
      // Create workbook
      const workbook = XLSX.utils.book_new();

      // Deal Summary Sheet
      const summaryData: (string | number)[][] = [
        ["Deal Summary"],
        [""],
        ["Deal Name", deal.name || "Untitled Deal"],
        [""],
        ["Financial Metrics"],
        ["Monthly Recurring Revenue (MRR)", money(totals.monthlyRevenue)],
        ["Annual Recurring Revenue (ARR)", money(totals.annualizedRevenue)],
        ["Total Contract Value (TCV)", money(totals.tcv)],
      ];

      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

      // Products Sheet
      const productsData: (string | number)[][] = [
        ["Products"],
        [""],
        ["Product Name", "Type", "Licenses", "Unit Price", "Total"],
      ];

      deal.products.forEach((product) => {
        if (product.type === "RECURRING") {
          const monthlyTotal = product.listPricePerUnitMonthly * product.licenses;
          productsData.push([
            product.name + (product.isService ? " (Service)" : ""),
            "Recurring",
            product.licenses,
            money(product.listPricePerUnitMonthly) + "/mo",
            money(monthlyTotal) + "/mo",
          ]);
        } else {
          productsData.push([
            product.name + (product.isService ? " (Service)" : ""),
            "One-time",
            "-",
            money(product.oneTimeListPrice),
            money(product.oneTimeListPrice),
          ]);
        }
      });

      const productsSheet = XLSX.utils.aoa_to_sheet(productsData);
      XLSX.utils.book_append_sheet(workbook, productsSheet, "Products");

      // Download
      const filename = `${deal.name?.replace(/[^a-z0-9]/gi, '_') || 'deal'}_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, filename);

      showSuccessToast("✓ Excel file downloaded!");
      setIsOpen(false);
    } catch (error) {
      console.error("Excel export error:", error);
      showSuccessToast("✗ Failed to export Excel");
      setIsOpen(false);
    }
  };

  const handleExportPDF = () => {
    // Check if user is not signed in
    if (!session) {
      setIsOpen(false);
      setShowUpgradeModal(true);
      return;
    }

    // Check subscription before allowing PDF export
    if (isFree) {
      setIsOpen(false);
      setShowUpgradeModal(true);
      return;
    }

    // Pro users: Trigger browser print-to-PDF
    window.print();
    showSuccessToast("💡 Use your browser's print dialog to save as PDF");
    setIsOpen(false);
  };

  return (
    <div className="relative print:hidden" ref={menuRef}>
      {/* Export Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg hover:shadow-xl"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export
        <svg className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-slate-800 border border-white/20 rounded-lg shadow-xl overflow-hidden z-50">
          <div className="py-1">
            {/* Export PDF - PRO ONLY */}
            <button
              onClick={handleExportPDF}
              className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-3 group relative"
            >
              <svg className="w-5 h-5 text-red-400 group-hover:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <div className="flex-1">
                <div className="font-medium">Export PDF</div>
                <div className="text-xs text-white/50">Save as PDF file</div>
              </div>
              {(!session || isFree) && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded uppercase tracking-wide">
                  PRO
                </span>
              )}
            </button>

            {/* Copy Summary - PRO ONLY */}
            <button
              onClick={handleCopySummary}
              className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-3 group relative"
            >
              <svg className="w-5 h-5 text-blue-400 group-hover:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <div className="flex-1">
                <div className="font-medium">Copy Summary</div>
                <div className="text-xs text-white/50">Plain text for Slack/email</div>
              </div>
              {(!session || isFree) && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded uppercase tracking-wide">
                  PRO
                </span>
              )}
            </button>

            {/* Export Excel - PRO ONLY */}
            <button
              onClick={handleExportExcel}
              className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-3 group relative"
            >
              <svg className="w-5 h-5 text-green-400 group-hover:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <div className="flex-1">
                <div className="font-medium">Export Excel</div>
                <div className="text-xs text-white/50">Download as spreadsheet</div>
              </div>
              {(!session || isFree) && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded uppercase tracking-wide">
                  PRO
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50 animate-slideInTop">
          <div className="bg-slate-800 border border-green-400/30 rounded-lg px-4 py-3 shadow-xl flex items-center gap-3">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-white font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature="Export Features"
      />
    </div>
  );
}
