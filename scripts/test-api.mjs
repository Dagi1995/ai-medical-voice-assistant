(async () => {
  try {
    const res = await fetch("http://localhost:3000/api/suggest-doctors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: "I have a fever and headache" }),
    });
    console.log("status", res.status);
    const text = await res.text();
    try {
      console.log("body JSON:", JSON.stringify(JSON.parse(text), null, 2));
    } catch (e) {
      console.log("body text:", text);
    }
  } catch (err) {
    console.error("request error:", err.message || err);
  }
})();
