import * as XLSX from 'xlsx';
import * as fs from 'fs';

const readExcel = (filename) => {
    const buf = fs.readFileSync(filename);
    const wb = XLSX.read(buf, { type: 'buffer' });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    // Skip header, filter empty rows
    return data.slice(1).filter(row => row[0] && row[1]);
};

const conceptual = readExcel('중등 구상형.xlsx');
const instant = readExcel('중등 즉답형.xlsx');

const filterQuestions = (data) => {
    return data.filter(row => !String(row[0]).includes('[사이다 예상문제 ]'))
        .map((row, idx) => ({
            id: idx + 1, // Will be re-indexed in storage.ts anyway, but good for structure
            name: String(row[0]),
            content: String(row[1]),
            image: null
        }));
};

const filteredConceptual = filterQuestions(conceptual);
const filteredInstant = filterQuestions(instant);

const result = {
    conceptual: filteredConceptual,
    instant: filteredInstant
};

fs.writeFileSync('questions.json', JSON.stringify(result, null, 2));
console.log('Done');
