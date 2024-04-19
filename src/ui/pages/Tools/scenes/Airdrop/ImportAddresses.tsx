import React from "react";
import * as XLSX from "xlsx";

interface IImportAddressesProps {
  onSubmit: (list: { address: string; amount: number }[]) => void;
}
const ImportAddresses = ({ onSubmit }: IImportAddressesProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files;
      if (files && files.length > 0) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          const list: any = [];
          rows.forEach((row: any) => {
            const address = row[0];
            const amount = row[1];
            if (!address) return false;
            // if (!wallet.isAddress(address) || !wallet.isScriptHash(address))
            //   return false;
            list.push({
              address: address,
              amount: amount,
            });
          });
          onSubmit(list);
        };
        reader.readAsBinaryString(files[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="notification content">
        <ul>
          <li>Upload an excel file (.xlsx or .xls)</li>
          <li>
            Ensure that the first column of the Excel file lists wallet
            addresses, and the second column specifies the corresponding
            amounts.
          </li>
        </ul>
      </div>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleChange}
        style={{ display: "none" }}
        id="file-input"
      />
      <label htmlFor="file-input" className="button is-fullwidth is-success">
        Choose file
      </label>
    </div>
  );
};

export default ImportAddresses;
