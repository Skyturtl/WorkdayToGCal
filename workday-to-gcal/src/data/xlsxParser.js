import * as xlsx from 'xlsx';

export function parseXlsxFileToJson(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target.result;
        const data = new Uint8Array(arrayBuffer);
        const workbook = xlsx.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const firstRow = xlsx.utils.sheet_to_json(worksheet, { header: 1 })[0][0];
        let json;
        if (firstRow === "View My Courses") {
          json = xlsx.utils.sheet_to_json(worksheet, { range: "A6:P30"});
          resolve(json);
        }
        else if (firstRow === "My Enrolled Courses") {
          json = xlsx.utils.sheet_to_json(worksheet, { range: "A3:P30"});
          resolve(json);
        } 
        else {
          json = xlsx.utils.sheet_to_json(worksheet, { range: "A6:P30"});
          resolve(json);
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}