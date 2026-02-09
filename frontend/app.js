const API_URL = "https://fraud-detector--fraudshield.replit.app/predict";

const btn = document.getElementById("predictBtn");
const msgInput = document.getElementById("msg");
const resultEl = document.getElementById("result");

btn.addEventListener("click", predict);

async function predict() {
  const text = msgInput.value.trim();

  if (!text) {
    alert("Paste an SMS message first");
    return;
  }

  resultEl.innerText = "Predicting...";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text }) //backend expects this
    });

    if (!response.ok) {
      throw new Error("Backend error");
    }

  
    const label = await response.text();

    resultEl.innerText = `Label: ${label}`;

  } catch (err) {
    console.error(err);
    resultEl.innerText = "Error contacting backend";
  }
}