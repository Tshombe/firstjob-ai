export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Allow preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  const { keywords } = req.query; // <-- match your frontend!
  if (!keywords) {
    return res.status(400).json({ error: "Missing keywords" });
  }

  try {
    const apiUrl = `https://remotive.io/api/remote-jobs?search=${encodeURIComponent(keywords)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Remotive API error:", error);
    res.status(500).json({ error: error.message });
  }
}
