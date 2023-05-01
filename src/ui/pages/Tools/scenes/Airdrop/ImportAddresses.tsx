import { wallet } from "@cityofzion/neon-core";
import React, { useState } from "react";
import * as XLSX from "xlsx";

interface IImportAddressesProps {
  onSubmit: (list: { address: string; amount: number }[]) => void;
}
const ImportAddresses = ({ onSubmit }: IImportAddressesProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          if (!wallet.isAddress(address)) return false;
          list.push({
            address: address,
            amount: amount
          });
        });
        onSubmit(list);
      };
      reader.readAsBinaryString(files[0]);
    }
  };

  return (
    <div>
      <div className="notification content">
        <ul>
          <li>
            Click 'Choose file' to select an Excel file (.xlsx or .xls) from
            your
          </li>
          <li>
            Ensure the first column contains wallet addresses and the second
            column contains amounts.
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
