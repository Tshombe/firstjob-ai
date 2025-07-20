export default async function handler(req, res) {
  // Enable CORS if you fetch from browser (optional for API routes)
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST allowed" });

  const { keywords = "", location = "" } = req.body;
  const JOOBLE_API_KEY = process.env.JOOBLE_API_KEY;
  if (!JOOBLE_API_KEY)
    return res.status(500).json({ error: "Jooble API key not set" });

  try {
    const joobleRes = await fetch(`https://jooble.org/api/${JOOBLE_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keywords, location }),
    });

    // Defensive: Jooble returns { jobs: [], ... } on success
    const data = await joobleRes.json();

    if (joobleRes.status !== 200) {
      // Jooble returns error as { error: "...", ... } with 200 status, but just in case:
      throw new Error(data.error || `Jooble error: ${joobleRes.statusText}`);
    }

    res.status(200).json({ jobs: data.jobs || [] });
  } catch (error) {
    // Log for Vercel debugging
    console.error("Jooble handler error:", error);
    res.status(500).json({ error: error.message || "Unknown error" });
  }
}
