export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST allowed" });

  const { keywords = "", location = "" } = req.body;
  // Set your Jooble API key in your Vercel project env vars
  const JOOBLE_API_KEY = process.env.JOOBLE_API_KEY;
  if (!JOOBLE_API_KEY) return res.status(500).json({ error: "Jooble API key not set" });

  try {
    const joobleRes = await fetch(`https://jooble.org/api/${JOOBLE_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keywords, location }),
    });
    const data = await joobleRes.json();
    res.status(200).json({ jobs: data.jobs || [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
