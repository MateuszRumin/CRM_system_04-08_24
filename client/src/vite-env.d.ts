/// <reference types="vite/client" />

// Rozszerzenie typów dla jsPDF
import 'jspdf-autotable';
import * as jsPDF from 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    autoTable(options: jsPDF.AutoTableOptions): void;
    lastAutoTable: jsPDF.AutoTable;
  }
}
