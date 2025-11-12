// TODO: replace with your deployed backend URL once hosted
const API_URL = "https://your-backend-service.onrender.com/recommend";

// Example symptom list (you can replace this by fetching from CSV)
const allSymptoms = [
  "Fever", "Cough", "Headache", "Cold", "Body Pain", "Nausea", "Vomiting"
];

const symptomList = document.getElementById("symptom-list");
const searchInput = document.getElementById("search");
const output = document.getElementById("output");

function renderSymptoms(filter = "") {
  symptomList.innerHTML = "";
  allSymptoms
    .filter(sym => sym.toLowerCase().includes(filter.toLowerCase()))
    .forEach(sym => {
      const div = document.createElement("div");
      div.innerHTML = `<label><input type="checkbox" value="${sym}"> ${sym}</label>`;
      symptomList.appendChild(div);
    });
}

searchInput.addEventListener("input", e => renderSymptoms(e.target.value));

document.getElementById("clear-btn").addEventListener("click", () => {
  document.getElementById("age").value = "";
  document.getElementById("duration").value = "";
  document.getElementById("output").value = "";
  document.querySelectorAll("#symptom-list input[type='checkbox']").forEach(cb => cb.checked = false);
});

document.getElementById("recommend-btn").addEventListener("click", async () => {
  const age = document.getElementById("age").value;
  const duration = document.getElementById("duration").value;
  const gender = document.querySelector("input[name='gender']:checked").value;
  const selected = Array.from(document.querySelectorAll("#symptom-list input:checked"))
    .map(cb => cb.value.toLowerCase());

  if (!selected.length) {
    output.value = "Please select at least one symptom.";
    return;
  }

  const body = {
    symptoms: selected.join(", "),
    age,
    gender,
    pregnancy: "no",
    feeding: "no",
    duration
  };

  output.value = "Fetching recommendation...";
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    output.value = data.result;
  } catch (err) {
    output.value = "Error connecting to backend: " + err;
  }
});

// initial load
renderSymptoms();
