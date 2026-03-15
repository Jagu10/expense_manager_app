"use client";

import * as XLSX from "xlsx";

interface ExportActionsProps {
  data: any[];
}

export default function ExportActions({ data }: ExportActionsProps) {
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    XLSX.writeFile(workbook, `Transactions_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToPDF = () => {
    window.print();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Excel Card */}
      <div className="premium-card flex flex-col items-center text-center gap-4 py-10">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-4xl">
          📊
        </div>
        <div>
          <h3 className="text-xl font-bold text-text-primary">Export to Excel</h3>
          <p className="text-text-secondary text-sm mt-1 max-w-xs mx-auto">
            Download all transactions as a <strong>.xlsx</strong> spreadsheet, ready for analysis in Microsoft Excel or Google Sheets.
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full max-w-xs">
          <button
            onClick={exportToExcel}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-premium"
          >
            <span>⬇️</span> Export to Excel (.xlsx)
          </button>
        </div>
      </div>

      {/* PDF Card */}
      <div className="premium-card flex flex-col items-center text-center gap-4 py-10">
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-4xl">
          📄
        </div>
        <div>
          <h3 className="text-xl font-bold text-text-primary">Export to PDF</h3>
          <p className="text-text-secondary text-sm mt-1 max-w-xs mx-auto">
            Generate a printable <strong>PDF report</strong> with a formatted summary of all your income and expense records.
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full max-w-xs">
          <button
            onClick={exportToPDF}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-premium"
          >
            <span>⬇️</span> Print / Export to PDF
          </button>
        </div>
      </div>
    </div>
  );
}
