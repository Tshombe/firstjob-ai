// api/remotive.js

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { search } = req.query;
  if (!search) {
    return res.status(400).json({ error: "Missing search parameter" });
  }
  try {
    const url = `https://remotive.io/api/remote-jobs?search=${encodeURIComponent(search)}`;
    const apiRes = await fetch(url);
    const data = await apiRes.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Remotive jobs" });
  }
}
