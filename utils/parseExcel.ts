import XLSX from "xlsx";
import fs from "fs";

export const parseExcelFile = (filePath: string): any[] => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet);
};
