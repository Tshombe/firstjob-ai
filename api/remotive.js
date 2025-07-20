export default async function handler(req, res) {
  const { search } = req.query;

  try {
    const apiUrl = `https://remotive.io/api/remote-jobs?search=${encodeURIComponent(search)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);
  } catch (error) {
    console.error("Remotive API error:", error);
    res.status(500).json({ error: error.message });
  }
}
