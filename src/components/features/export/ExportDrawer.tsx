"use client";

import { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/state/store";
import { calcDealTotals, calcRecurringProduct, calcOneTimeProduct } from "@/lib/calc";
import { money, num } from "@/lib/format";
import type { Deal, Product } from "@/lib/validators";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

type ExportDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

type ExportTab = "customer-safe" | "internal";

// Helper function to calculate product totals based on type
function calcProductTotals(deal: Deal, product: Product) {
  if (product.type === "RECURRING") {
    return calcRecurringProduct(product, deal);
  } else {
    return calcOneTimeProduct(product);
  }
}

export function ExportDrawer({ isOpen, onClose }: ExportDrawerProps) {
  const [activeTab, setActiveTab] = useState<ExportTab>("customer-safe");
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const selectedDealId = useAppStore((s) => s.selectedDealId);
  const deal = useAppStore((s) => s.deals.find((d) => d.id === selectedDealId));

  if (!deal) return null;

  const totals = calcDealTotals(deal);

  const handleCopyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess(activeTab);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatCustomerSafeExport = (deal: Deal): string => {
    const totals = calcDealTotals(deal);
    const billingLabel = deal.billingCadence === "MONTHLY" ? "Monthly" : "Annual Prepay";
    const termLabel =
      deal.contractLengthType === "MONTH_TO_MONTH"
        ? "Month-to-Month"
        : deal.contractLengthType === "MONTHS"
        ? `${deal.contractMonths} months`
        : `${deal.contractYears} ${deal.contractYears === 1 ? "year" : "years"}`;

    let output = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    output += `📊 ${deal.name}\n`;
    output += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    // Deal Shape
    output += `📋 DEAL SHAPE\n`;
    output += `• Billing: ${billingLabel}\n`;
    output += `• Term: ${termLabel}\n`;
    if (deal.toggles.includeFreeMonths && deal.freeMonthsUpFront > 0) {
      output += `• Free months: ${deal.freeMonthsUpFront}\n`;
    }
    output += `\n`;

    // Products
    output += `📦 PRODUCTS\n`;
    output += `\n`;

    deal.products.forEach((product, index) => {
      const productTotals = calcProductTotals(deal, product);

      output += `${index + 1}. ${product.name} ${product.isService ? "(Service)" : ""}\n`;

      if (product.type === "RECURRING") {
        output += `   • Price: ${money(productTotals.listUnitPriceMonthly)}/mo per license\n`;
        output += `   • Licenses: ${product.licenses}\n`;

        if (product.customerDiscountValue > 0) {
          output += `   • Discount: `;
          if (product.customerDiscountMode === "PERCENT") {
            output += `${num(product.customerDiscountValue, 0)}%\n`;
          } else {
            output += `${money(product.customerDiscountValue)}/mo\n`;
          }
        }

        output += `   • Monthly Total: ${money(productTotals.monthlyRevenue)}\n`;
        output += `   • Annual Total: ${money(productTotals.annualizedRevenue)}\n`;
      } else {
        output += `   • Price: ${money(productTotals.listOneTimePrice)}\n`;

        if (product.customerDiscountValue > 0) {
          output += `   • Discount: `;
          if (product.customerDiscountMode === "PERCENT") {
            output += `${num(product.customerDiscountValue, 0)}%\n`;
          } else {
            output += `${money(product.customerDiscountValue)}\n`;
          }
        }

        output += `   • Total: ${money(productTotals.effectiveOneTimePrice)}\n`;
      }

      output += `\n`;
    });

    // Totals
    output += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    output += `💰 TOTALS\n`;
    output += `• Monthly Recurring: ${money(totals.monthlyRevenue)}\n`;
    output += `• Annual Recurring: ${money(totals.annualizedRevenue)}\n`;
    output += `• Total Contract Value: ${money(totals.tcv)}\n`;

    if (totals.servicesRevenue > 0) {
      output += `\n📊 BREAKDOWN\n`;
      output += `• Software Revenue: ${money(totals.softwareRevenue)}\n`;
      output += `• Services Revenue: ${money(totals.servicesRevenue)}\n`;
    }

    output += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

    return output;
  };

  const formatInternalExport = (deal: Deal): string => {
    const totals = calcDealTotals(deal);
    const billingLabel = deal.billingCadence === "MONTHLY" ? "Monthly" : "Annual Prepay";
    const termLabel =
      deal.contractLengthType === "MONTH_TO_MONTH"
        ? "Month-to-Month"
        : deal.contractLengthType === "MONTHS"
        ? `${deal.contractMonths} months`
        : `${deal.contractYears} ${deal.contractYears === 1 ? "year" : "years"}`;

    let output = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    output += `🔒 INTERNAL DEAL ANALYSIS\n`;
    output += `📊 ${deal.name}\n`;
    output += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    // Deal Shape
    output += `📋 DEAL SHAPE\n`;
    output += `• Billing: ${billingLabel}\n`;
    output += `• Term: ${termLabel}\n`;
    output += `• Term Months: ${totals.termMonths}\n`;
    output += `• Billable Months: ${totals.billableMonths}\n`;

    if (deal.toggles.includeFreeMonths && deal.freeMonthsUpFront > 0) {
      output += `• Free Months Up Front: ${deal.freeMonthsUpFront}\n`;
    }

    if (deal.toggles.includeRamp && deal.rampMonths > 0) {
      output += `• Ramp Period: ${deal.rampMonths} months @ ${num(deal.rampDiscountPct, 0)}% discount\n`;
    }

    if (deal.toggles.includeEscalation && deal.annualEscalatorPct > 0) {
      output += `• Annual Escalation: ${num(deal.annualEscalatorPct, 1)}%\n`;
    }

    output += `\n`;

    // Products with Profit Details
    output += `📦 PRODUCTS & PROFITABILITY\n`;
    output += `\n`;

    deal.products.forEach((product, index) => {
      const productTotals = calcProductTotals(deal, product);

      output += `${index + 1}. ${product.name} ${product.isService ? "(Service)" : ""}\n`;

      if (product.type === "RECURRING") {
        output += `   • List Price: ${money(productTotals.listUnitPriceMonthly)}/mo per license\n`;
        output += `   • Licenses: ${product.licenses}\n`;

        if (product.customerDiscountValue > 0) {
          output += `   • Customer Discount: `;
          if (product.customerDiscountMode === "PERCENT") {
            output += `${num(product.customerDiscountValue, 0)}%\n`;
          } else {
            output += `${money(product.customerDiscountValue)}/mo\n`;
          }
        }

        if (product.partnerCommissionPct > 0) {
          output += `   • Partner Commission: ${num(product.partnerCommissionPct, 1)}%\n`;
        }

        output += `   • Effective Price: ${money(productTotals.effectiveUnitPriceMonthly)}/mo\n`;
        output += `   • Monthly Revenue: ${money(productTotals.monthlyRevenue)}\n`;
        output += `   • Monthly Profit: ${money(productTotals.monthlyProfit)}\n`;

        if (product.profitMode === "MARGIN_PCT") {
          output += `   • Margin: ${num(product.marginPct * 100, 1)}%\n`;
        } else {
          output += `   • Profit/License: ${money(product.profitPerUnitMonthly)}/mo\n`;
        }
      } else {
        output += `   • List Price: ${money(productTotals.listOneTimePrice)}\n`;

        if (product.customerDiscountValue > 0) {
          output += `   • Customer Discount: `;
          if (product.customerDiscountMode === "PERCENT") {
            output += `${num(product.customerDiscountValue, 0)}%\n`;
          } else {
            output += `${money(product.customerDiscountValue)}\n`;
          }
        }

        output += `   • Effective Price: ${money(productTotals.effectiveOneTimePrice)}\n`;
        output += `   • Total Profit: ${money(productTotals.termProfit)}\n`;
      }

      output += `\n`;
    });

    // Financial Totals
    output += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    output += `💰 FINANCIAL SUMMARY\n`;
    output += `\n`;
    output += `📈 REVENUE\n`;
    output += `• Monthly Recurring: ${money(totals.monthlyRevenue)}\n`;
    output += `• Annual Recurring: ${money(totals.annualizedRevenue)}\n`;
    output += `• Total Contract Value: ${money(totals.tcv)}\n`;
    output += `• Effective MRR: ${money(totals.effectiveMRR)}\n`;

    if (totals.servicesRevenue > 0) {
      output += `\n📊 BREAKDOWN\n`;
      output += `• Software Revenue: ${money(totals.softwareRevenue)}\n`;
      output += `• Services Revenue: ${money(totals.servicesRevenue)}\n`;
    }

    output += `\n💵 PROFITABILITY\n`;
    output += `• Monthly Profit: ${money(totals.monthlyProfit)}\n`;
    output += `• Term Profit: ${money(totals.termProfit)}\n`;

    if (totals.blendedMarginPct !== null) {
      output += `• Blended Margin: ${num(totals.blendedMarginPct, 1)}%\n`;
    }

    if (totals.servicesRevenue > 0) {
      output += `• Software Profit: ${money(totals.softwareProfit)}\n`;
      output += `• Services Profit: ${money(totals.servicesProfit)}\n`;
    }

    // Unit Economics
    if (deal.toggles.includeCAC && deal.cac > 0) {
      output += `\n📊 UNIT ECONOMICS\n`;
      output += `• CAC: ${money(totals.cac)}\n`;
      output += `• Contracted LTV: ${money(totals.contractedLTV)}\n`;

      if (totals.ltvToCac !== null) {
        output += `• LTV:CAC Ratio: ${num(totals.ltvToCac, 2)}:1\n`;
      }

      if (totals.paybackMonths !== null) {
        output += `• Payback Period: ${num(totals.paybackMonths, 1)} months\n`;
      }
    }

    // Discount Analysis
    if (totals.avgDiscountDepthPct > 0) {
      output += `\n⚠️ DISCOUNT ANALYSIS\n`;
      output += `• Avg Discount: ${num(totals.avgDiscountDepthPct, 1)}%\n`;

      if (totals.exceedsDiscountFloor) {
        output += `• ⚠️ WARNING: Exceeds discount floor (${num(deal.discountFloorPct, 0)}%)\n`;
      }
    }

    output += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

    return output;
  };

  const customerSafeContent = formatCustomerSafeExport(deal);
  const internalContent = formatInternalExport(deal);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const isInternal = activeTab === "internal";

    // Page margins
    const marginLeft = 20;
    const marginRight = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - marginLeft - marginRight;

    let yPosition = 20;

    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(isInternal ? "INTERNAL DEAL ANALYSIS" : "DEAL SUMMARY", marginLeft, yPosition);
    yPosition += 10;

    doc.setFontSize(14);
    doc.text(deal.name, marginLeft, yPosition);
    yPosition += 10;

    // Deal Shape Section
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Deal Shape", marginLeft, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const billingLabel = deal.billingCadence === "MONTHLY" ? "Monthly" : "Annual Prepay";
    const termLabel =
      deal.contractLengthType === "MONTH_TO_MONTH"
        ? "Month-to-Month"
        : deal.contractLengthType === "MONTHS"
        ? `${deal.contractMonths} months`
        : `${deal.contractYears} ${deal.contractYears === 1 ? "year" : "years"}`;

    doc.text(`Billing: ${billingLabel}`, marginLeft + 5, yPosition);
    yPosition += 5;
    doc.text(`Term: ${termLabel}`, marginLeft + 5, yPosition);
    yPosition += 5;

    if (isInternal) {
      doc.text(`Term Months: ${totals.termMonths}`, marginLeft + 5, yPosition);
      yPosition += 5;
      doc.text(`Billable Months: ${totals.billableMonths}`, marginLeft + 5, yPosition);
      yPosition += 5;
    }

    if (deal.toggles.includeFreeMonths && deal.freeMonthsUpFront > 0) {
      doc.text(`Free Months: ${deal.freeMonthsUpFront}`, marginLeft + 5, yPosition);
      yPosition += 5;
    }

    if (isInternal && deal.toggles.includeRamp && deal.rampMonths > 0) {
      doc.text(`Ramp Period: ${deal.rampMonths} months @ ${num(deal.rampDiscountPct, 0)}% discount`, marginLeft + 5, yPosition);
      yPosition += 5;
    }

    if (isInternal && deal.toggles.includeEscalation && deal.annualEscalatorPct > 0) {
      doc.text(`Annual Escalation: ${num(deal.annualEscalatorPct, 1)}%`, marginLeft + 5, yPosition);
      yPosition += 5;
    }

    yPosition += 5;

    // Products Table
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(isInternal ? "Products & Profitability" : "Products", marginLeft, yPosition);
    yPosition += 7;

    const productRows: string[][] = [];

    deal.products.forEach((product) => {
      const productTotals = calcProductTotals(deal, product);

      if (product.type === "RECURRING") {
        if (isInternal) {
          productRows.push([
            product.name + (product.isService ? " (Service)" : ""),
            money(productTotals.listUnitPriceMonthly) + "/mo",
            product.licenses.toString(),
            money(productTotals.monthlyRevenue),
            money(productTotals.monthlyProfit)
          ]);
        } else {
          productRows.push([
            product.name + (product.isService ? " (Service)" : ""),
            money(productTotals.listUnitPriceMonthly) + "/mo",
            product.licenses.toString(),
            money(productTotals.monthlyRevenue),
            money(productTotals.annualizedRevenue)
          ]);
        }
      } else {
        if (isInternal) {
          productRows.push([
            product.name + (product.isService ? " (Service)" : ""),
            money(productTotals.listOneTimePrice),
            "-",
            money(productTotals.effectiveOneTimePrice),
            money(productTotals.termProfit)
          ]);
        } else {
          productRows.push([
            product.name + (product.isService ? " (Service)" : ""),
            money(productTotals.listOneTimePrice),
            "-",
            money(productTotals.effectiveOneTimePrice),
            "-"
          ]);
        }
      }
    });

    autoTable(doc, {
      startY: yPosition,
      head: [isInternal
        ? ["Product", "Price", "Licenses", "Monthly Rev", "Monthly Profit"]
        : ["Product", "Price", "Licenses", "Monthly Total", "Annual Total"]
      ],
      body: productRows,
      theme: "striped",
      headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: "bold" },
      margin: { left: marginLeft, right: marginRight },
      styles: { fontSize: 9 }
    });

    yPosition = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    // Totals Section
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(isInternal ? "Financial Summary" : "Totals", marginLeft, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    doc.text(`Monthly Recurring: ${money(totals.monthlyRevenue)}`, marginLeft + 5, yPosition);
    yPosition += 5;
    doc.text(`Annual Recurring: ${money(totals.annualizedRevenue)}`, marginLeft + 5, yPosition);
    yPosition += 5;
    doc.text(`Total Contract Value: ${money(totals.tcv)}`, marginLeft + 5, yPosition);
    yPosition += 5;

    if (isInternal) {
      doc.text(`Effective MRR: ${money(totals.effectiveMRR)}`, marginLeft + 5, yPosition);
      yPosition += 10;

      doc.setFont("helvetica", "bold");
      doc.text("Profitability", marginLeft + 5, yPosition);
      yPosition += 5;
      doc.setFont("helvetica", "normal");

      doc.text(`Monthly Profit: ${money(totals.monthlyProfit)}`, marginLeft + 5, yPosition);
      yPosition += 5;
      doc.text(`Term Profit: ${money(totals.termProfit)}`, marginLeft + 5, yPosition);
      yPosition += 5;

      if (totals.blendedMarginPct !== null) {
        doc.text(`Blended Margin: ${num(totals.blendedMarginPct, 1)}%`, marginLeft + 5, yPosition);
        yPosition += 5;
      }

      if (deal.toggles.includeCAC && deal.cac > 0) {
        yPosition += 5;
        doc.setFont("helvetica", "bold");
        doc.text("Unit Economics", marginLeft + 5, yPosition);
        yPosition += 5;
        doc.setFont("helvetica", "normal");

        doc.text(`CAC: ${money(totals.cac)}`, marginLeft + 5, yPosition);
        yPosition += 5;
        doc.text(`Contracted LTV: ${money(totals.contractedLTV)}`, marginLeft + 5, yPosition);
        yPosition += 5;

        if (totals.ltvToCac !== null) {
          doc.text(`LTV:CAC Ratio: ${num(totals.ltvToCac, 2)}:1`, marginLeft + 5, yPosition);
          yPosition += 5;
        }

        if (totals.paybackMonths !== null) {
          doc.text(`Payback Period: ${num(totals.paybackMonths, 1)} months`, marginLeft + 5, yPosition);
          yPosition += 5;
        }
      }

      if (totals.avgDiscountDepthPct > 0) {
        yPosition += 5;
        doc.setFont("helvetica", "bold");
        doc.text("Discount Analysis", marginLeft + 5, yPosition);
        yPosition += 5;
        doc.setFont("helvetica", "normal");

        doc.text(`Avg Discount: ${num(totals.avgDiscountDepthPct, 1)}%`, marginLeft + 5, yPosition);
        yPosition += 5;

        if (totals.exceedsDiscountFloor) {
          doc.setTextColor(255, 0, 0);
          doc.text(`WARNING: Exceeds discount floor (${num(deal.discountFloorPct, 0)}%)`, marginLeft + 5, yPosition);
          doc.setTextColor(0, 0, 0);
          yPosition += 5;
        }
      }
    }

    if (totals.servicesRevenue > 0) {
      yPosition += 5;
      doc.setFont("helvetica", "bold");
      doc.text("Breakdown", marginLeft + 5, yPosition);
      yPosition += 5;
      doc.setFont("helvetica", "normal");

      doc.text(`Software Revenue: ${money(totals.softwareRevenue)}`, marginLeft + 5, yPosition);
      yPosition += 5;
      doc.text(`Services Revenue: ${money(totals.servicesRevenue)}`, marginLeft + 5, yPosition);
      yPosition += 5;

      if (isInternal) {
        doc.text(`Software Profit: ${money(totals.softwareProfit)}`, marginLeft + 5, yPosition);
        yPosition += 5;
        doc.text(`Services Profit: ${money(totals.servicesProfit)}`, marginLeft + 5, yPosition);
      }
    }

    // Footer
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128);
      doc.text(
        `Generated by DealQuary - ${new Date().toLocaleDateString()}`,
        marginLeft,
        doc.internal.pageSize.getHeight() - 10
      );
      doc.text(
        isInternal ? "INTERNAL USE ONLY - CONFIDENTIAL" : "Customer Quote",
        pageWidth - marginRight - 60,
        doc.internal.pageSize.getHeight() - 10
      );
    }

    // Download
    const filename = `${deal.name.replace(/[^a-z0-9]/gi, '_')}_${isInternal ? 'internal' : 'customer'}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
  };

  const handleDownloadExcel = () => {
    const isInternal = activeTab === "internal";
    const workbook = XLSX.utils.book_new();

    // Deal Shape Sheet
    const dealShapeData: string[][] = [
      ["Deal Shape"],
      [""],
      ["Deal Name", deal.name],
      ["Billing", deal.billingCadence === "MONTHLY" ? "Monthly" : "Annual Prepay"],
      [
        "Term",
        deal.contractLengthType === "MONTH_TO_MONTH"
          ? "Month-to-Month"
          : deal.contractLengthType === "MONTHS"
          ? `${deal.contractMonths} months`
          : `${deal.contractYears} ${deal.contractYears === 1 ? "year" : "years"}`
      ]
    ];

    if (isInternal) {
      dealShapeData.push(["Term Months", totals.termMonths.toString()]);
      dealShapeData.push(["Billable Months", totals.billableMonths.toString()]);
    }

    if (deal.toggles.includeFreeMonths && deal.freeMonthsUpFront > 0) {
      dealShapeData.push(["Free Months Up Front", deal.freeMonthsUpFront.toString()]);
    }

    if (isInternal && deal.toggles.includeRamp && deal.rampMonths > 0) {
      dealShapeData.push([
        "Ramp Period",
        `${deal.rampMonths} months @ ${num(deal.rampDiscountPct, 0)}% discount`
      ]);
    }

    if (isInternal && deal.toggles.includeEscalation && deal.annualEscalatorPct > 0) {
      dealShapeData.push(["Annual Escalation", `${num(deal.annualEscalatorPct, 1)}%`]);
    }

    const dealShapeSheet = XLSX.utils.aoa_to_sheet(dealShapeData);
    XLSX.utils.book_append_sheet(workbook, dealShapeSheet, "Deal Shape");

    // Products Sheet
    const productsData: (string | number)[][] = [
      ["Products" + (isInternal ? " & Profitability" : "")],
      [""],
      isInternal
        ? ["Product", "Price", "Licenses", "Monthly Revenue", "Monthly Profit"]
        : ["Product", "Price", "Licenses", "Monthly Total", "Annual Total"]
    ];

    deal.products.forEach((product) => {
      const productTotals = calcProductTotals(deal, product);
      const productName = product.name + (product.isService ? " (Service)" : "");

      if (product.type === "RECURRING") {
        if (isInternal) {
          productsData.push([
            productName,
            money(productTotals.listUnitPriceMonthly) + "/mo",
            product.licenses,
            money(productTotals.monthlyRevenue),
            money(productTotals.monthlyProfit)
          ]);
        } else {
          productsData.push([
            productName,
            money(productTotals.listUnitPriceMonthly) + "/mo",
            product.licenses,
            money(productTotals.monthlyRevenue),
            money(productTotals.annualizedRevenue)
          ]);
        }
      } else {
        if (isInternal) {
          productsData.push([
            productName,
            money(productTotals.listOneTimePrice),
            "-",
            money(productTotals.effectiveOneTimePrice),
            money(productTotals.termProfit)
          ]);
        } else {
          productsData.push([
            productName,
            money(productTotals.listOneTimePrice),
            "-",
            money(productTotals.effectiveOneTimePrice),
            "-"
          ]);
        }
      }
    });

    const productsSheet = XLSX.utils.aoa_to_sheet(productsData);
    XLSX.utils.book_append_sheet(workbook, productsSheet, "Products");

    // Financial Summary Sheet
    const summaryData: string[][] = [
      [isInternal ? "Financial Summary" : "Totals"],
      [""],
      ["Revenue"],
      ["Monthly Recurring", money(totals.monthlyRevenue)],
      ["Annual Recurring", money(totals.annualizedRevenue)],
      ["Total Contract Value", money(totals.tcv)]
    ];

    if (isInternal) {
      summaryData.push(["Effective MRR", money(totals.effectiveMRR)]);
      summaryData.push(["", ""]);
      summaryData.push(["Profitability"]);
      summaryData.push(["Monthly Profit", money(totals.monthlyProfit)]);
      summaryData.push(["Term Profit", money(totals.termProfit)]);

      if (totals.blendedMarginPct !== null) {
        summaryData.push(["Blended Margin", `${num(totals.blendedMarginPct, 1)}%`]);
      }

      if (deal.toggles.includeCAC && deal.cac > 0) {
        summaryData.push(["", ""]);
        summaryData.push(["Unit Economics"]);
        summaryData.push(["CAC", money(totals.cac)]);
        summaryData.push(["Contracted LTV", money(totals.contractedLTV)]);

        if (totals.ltvToCac !== null) {
          summaryData.push(["LTV:CAC Ratio", `${num(totals.ltvToCac, 2)}:1`]);
        }

        if (totals.paybackMonths !== null) {
          summaryData.push(["Payback Period", `${num(totals.paybackMonths, 1)} months`]);
        }
      }

      if (totals.avgDiscountDepthPct > 0) {
        summaryData.push(["", ""]);
        summaryData.push(["Discount Analysis"]);
        summaryData.push(["Avg Discount", `${num(totals.avgDiscountDepthPct, 1)}%`]);

        if (totals.exceedsDiscountFloor) {
          summaryData.push([
            "WARNING",
            `Exceeds discount floor (${num(deal.discountFloorPct, 0)}%)`
          ]);
        }
      }
    }

    if (totals.servicesRevenue > 0) {
      summaryData.push(["", ""]);
      summaryData.push(["Breakdown"]);
      summaryData.push(["Software Revenue", money(totals.softwareRevenue)]);
      summaryData.push(["Services Revenue", money(totals.servicesRevenue)]);

      if (isInternal) {
        summaryData.push(["Software Profit", money(totals.softwareProfit)]);
        summaryData.push(["Services Profit", money(totals.servicesProfit)]);
      }
    }

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, isInternal ? "Financial Summary" : "Totals");

    // Download
    const filename = `${deal.name.replace(/[^a-z0-9]/gi, '_')}_${isInternal ? 'internal' : 'customer'}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, filename);
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Export Deal" side="right">
      <div className="space-y-4">
        {/* Tab Selector */}
        <div className="flex gap-2 p-1 bg-white/5 rounded-lg">
          <button
            onClick={() => setActiveTab("customer-safe")}
            className={`
              flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all
              ${activeTab === "customer-safe"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30"
                : "text-white/60 hover:text-white/80 hover:bg-white/5"
              }
            `}
          >
            Customer-Safe
          </button>
          <button
            onClick={() => setActiveTab("internal")}
            className={`
              flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all
              ${activeTab === "internal"
                ? "bg-purple-500/20 text-purple-300 border border-purple-400/30"
                : "text-white/60 hover:text-white/80 hover:bg-white/5"
              }
            `}
          >
            🔒 Internal
          </button>
        </div>

        {/* Info Banner */}
        {activeTab === "customer-safe" ? (
          <div className="p-3 bg-cyan-500/10 border border-cyan-400/20 rounded-lg">
            <div className="flex gap-2">
              <svg className="w-5 h-5 text-cyan-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-cyan-300">Safe to share</p>
                <p className="text-xs text-cyan-300/70 mt-0.5">
                  Excludes: margins, costs, payback, internal metrics
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-purple-500/10 border border-purple-400/20 rounded-lg">
            <div className="flex gap-2">
              <svg className="w-5 h-5 text-purple-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-purple-300">Internal only</p>
                <p className="text-xs text-purple-300/70 mt-0.5">
                  Includes: margins, profits, CAC, LTV, payback period
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Preview */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wide">Preview</h3>
            <span className="text-xs text-white/40">Formatted for Slack/Text</span>
          </div>
          <div className="bg-black/40 rounded border border-white/5 p-4 max-h-96 overflow-y-auto">
            <pre className="text-xs text-white/80 font-mono whitespace-pre-wrap">
              {activeTab === "customer-safe" ? customerSafeContent : internalContent}
            </pre>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button
            variant="primary"
            onClick={() => handleCopyToClipboard(activeTab === "customer-safe" ? customerSafeContent : internalContent)}
            className="w-full !py-3"
          >
            {copySuccess === activeTab ? (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied to Clipboard!
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy to Clipboard
              </>
            )}
          </Button>

          <Button
            variant="secondary"
            onClick={handleDownloadPDF}
            className="w-full !py-2"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Download PDF
          </Button>

          <Button
            variant="secondary"
            onClick={handleDownloadExcel}
            className="w-full !py-2"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Excel
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
