import React, { useState } from 'react';
import { Upload, FileSpreadsheet, Check, AlertCircle } from 'lucide-react';

export const CsvUploader = ({
  title = "Bulk CSV Onboarding Uploader",
  sampleHeaders = ["Full Name", "Institutional Email", "Department", "Designation", "Capacity"],
  onImport = () => {}
}) => {
  const [fileData, setFileData] = useState(null);
  const [fileName, setFileName] = useState("");
  const [parseError, setParseError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setParseError(null);
    setSuccessMsg("");

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target.result;
        const lines = text.split('\n').filter(line => line.trim().length > 0);
        if (lines.length < 2) {
          throw new Error("CSV file must contain a header line and at least one data row.");
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
        const rows = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
          const rowObj = {};
          headers.forEach((h, idx) => {
            rowObj[h] = values[idx] || '';
          });
          return rowObj;
        });

        setFileData({ headers, rows });
      } catch (err) {
        setParseError(err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleSampleLoad = () => {
    setFileName("sample_faculty_roster.csv");
    setParseError(null);
    setSuccessMsg("");

    const sampleRows = [
      { "Full Name": "Dr. Sunita Murmu", "Institutional Email": "sunita.m@bitmesra.ac.in", "Department": "Civil Engineering", "Designation": "Professor", "Capacity": "5" },
      { "Full Name": "Dr. Rajesh K. Sharma", "Institutional Email": "rk.sharma@iitism.ac.in", "Department": "Environmental Science", "Designation": "Associate Professor", "Capacity": "4" },
      { "Full Name": "Dr. Vikas Oraon", "Institutional Email": "v.oraon@nitjsr.ac.in", "Department": "Metallurgical Engg", "Designation": "Assistant Professor", "Capacity": "3" }
    ];

    setFileData({ headers: sampleHeaders, rows: sampleRows });
  };

  const handleConfirmImport = () => {
    if (!fileData || fileData.rows.length === 0) return;
    onImport(fileData.rows);
    setSuccessMsg(`Successfully imported ${fileData.rows.length} record(s) into system roster!`);
    setFileData(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
            <FileSpreadsheet className="w-4 h-4 text-teal-600" />
            <span>{title}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Supports CSV / Excel exports with header matching</p>
        </div>

        <button
          onClick={handleSampleLoad}
          className="text-xs text-teal-700 hover:text-teal-900 font-semibold underline"
        >
          Load Sample Data
        </button>
      </div>

      {/* File Upload Box */}
      <div className="border-2 border-dashed border-slate-300 hover:border-teal-600 rounded-xl p-6 text-center transition cursor-pointer bg-slate-50 hover:bg-teal-50/30 relative">
        <input
          type="file"
          accept=".csv,.txt"
          onChange={handleFileUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-xs font-semibold text-slate-700">
          {fileName ? `Loaded: ${fileName}` : "Click or drag & drop .CSV file to ingest bulk roster"}
        </p>
        <p className="text-[11px] text-slate-400 mt-1">Expected columns: {sampleHeaders.join(", ")}</p>
      </div>

      {parseError && (
        <div className="mt-3 bg-red-50 text-red-700 p-3 rounded-lg text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{parseError}</span>
        </div>
      )}

      {successMsg && (
        <div className="mt-3 bg-emerald-50 text-emerald-700 p-3 rounded-lg text-xs flex items-center space-x-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Table Preview */}
      {fileData && (
        <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 flex justify-between items-center">
            <span>Preview ({fileData.rows.length} rows parsed)</span>
            <button
              onClick={handleConfirmImport}
              className="bg-teal-700 hover:bg-teal-800 text-white text-xs px-3 py-1 rounded-lg font-bold shadow-sm transition"
            >
              Confirm & Ingest Roster
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold">
                <tr>
                  {fileData.headers.map((h, i) => (
                    <th key={i} className="px-3 py-2 border-b">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fileData.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50">
                    {fileData.headers.map((h, cIdx) => (
                      <td key={cIdx} className="px-3 py-2 text-slate-800">{row[h] || '-'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
