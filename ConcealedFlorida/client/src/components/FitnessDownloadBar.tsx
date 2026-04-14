import { useState, useRef, useEffect } from "react";
import { FileText, FileSpreadsheet, File, Printer, ChevronDown } from "lucide-react";
import type { CategoryRow } from "@/data/fitnessData";
import type { Gender, DocType } from "@/lib/fitnessGuides";
import {
  downloadFitnessAsTxt,
  downloadFitnessAsWord,
  downloadFitnessAsCsv,
  printFitnessAsPdf,
} from "@/lib/fitnessGuides";

interface FormatOption {
  label: string;
  ext: string;
  icon: React.ComponentType<{ className?: string }>;
  action: (catKey: keyof CategoryRow, gender: Gender, docType: DocType) => void;
}

const formats: FormatOption[] = [
  { label: "Word (.doc)",  ext: "doc",  icon: File,          action: downloadFitnessAsWord },
  { label: "Excel (.csv)", ext: "csv",  icon: FileSpreadsheet, action: downloadFitnessAsCsv },
  { label: "Text (.txt)",  ext: "txt",  icon: FileText,       action: downloadFitnessAsTxt },
  { label: "PDF (print)",  ext: "pdf",  icon: Printer,        action: printFitnessAsPdf },
];

interface DocConfig {
  docType: DocType;
  label: string;
  color: string;
  borderColor: string;
  accentBg: string;
  chevronColor: string;
}

const docConfigs: DocConfig[] = [
  {
    docType:     "civilian",
    label:       "Civilian Guide",
    color:       "text-blue-400",
    borderColor: "border-blue-800/40",
    accentBg:    "bg-blue-900/20",
    chevronColor: "text-blue-400",
  },
  {
    docType:     "military",
    label:       "Military Guide",
    color:       "text-green-400",
    borderColor: "border-green-800/40",
    accentBg:    "bg-green-900/20",
    chevronColor: "text-green-400",
  },
  {
    docType:     "assessment",
    label:       "Assessment Sheet",
    color:       "text-yellow-400",
    borderColor: "border-yellow-800/40",
    accentBg:    "bg-yellow-900/20",
    chevronColor: "text-yellow-400",
  },
];

interface DropdownButtonProps {
  config: DocConfig;
  catKey: keyof CategoryRow;
  gender: Gender;
  catNum: number;
}

function DropdownButton({ config, catKey, gender, catNum }: DropdownButtonProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const { docType, label, color, borderColor, accentBg, chevronColor } = config;

  return (
    <div ref={ref} className="relative flex-1 min-w-[140px]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-md border ${borderColor} ${accentBg} ${color} text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer`}
        data-testid={`button-download-${catKey}-${docType}-${catNum}`}
        aria-expanded={open}
      >
        <span className="truncate">{label}</span>
        <ChevronDown className={`w-3 h-3 shrink-0 ${chevronColor} transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 bottom-full mb-1 left-0 right-0 bg-[#1a1a1a] border border-gray-700 rounded-md shadow-lg overflow-hidden">
          {formats.map((fmt) => {
            const Icon = fmt.icon;
            return (
              <button
                key={fmt.ext}
                type="button"
                onClick={() => {
                  fmt.action(catKey, gender, docType);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-gray-200 hover:bg-white/10 transition-colors cursor-pointer text-left"
                data-testid={`button-dl-${catKey}-${docType}-${fmt.ext}-${catNum}`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                {fmt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface FitnessDownloadBarProps {
  catKey: keyof CategoryRow;
  gender: Gender;
  catNum: number;
}

export default function FitnessDownloadBar({ catKey, gender, catNum }: FitnessDownloadBarProps) {
  return (
    <div className="mt-4">
      <p className="text-gray-500 text-xs mb-2 font-medium uppercase tracking-wider">Download Guides</p>
      <div className="flex flex-wrap gap-2">
        {docConfigs.map((cfg) => (
          <DropdownButton
            key={cfg.docType}
            config={cfg}
            catKey={catKey}
            gender={gender}
            catNum={catNum}
          />
        ))}
      </div>
    </div>
  );
}
