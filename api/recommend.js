import fs from "fs";
import path from "path";
import Papa from "papaparse";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  // Read the CSV file
  const filePath = path.join(process.cwd(), "demo6.csv");
  let csvData;
  try {
    const file = fs.readFileSync(filePath, "utf8");
    csvData = Papa.parse(file, { header: true }).data;
  } catch (err) {
    return res.status(500).json({ error: "Failed to read demo6.csv" });
  }

  const { symptoms, age, gender, duration } = req.body;
  const symptomList = symptoms.split(",").map(s => s.trim().toLowerCase());

  let results = [];

  for (let s of symptomList) {
    const matches = csvData.filter(row =>
      row.Symptom && row.Symptom.toLowerCase().includes(s)
    );

    if (matches.length > 0) {
      results.push(`For symptom '${s}':`);
      matches.forEach(m => {
        results.push(`  → Medicine: ${m.Medicine || "N/A"} | Dosage: ${m.Dosage || "N/A"}`);
      });
    } else {
      results.push(`No match found for symptom '${s}'.`);
    }
  }

  res.status(200).json({ result: results.join("\n") });
}
