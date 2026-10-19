// Vercel serverless function: GET /api/check?address=0x...
// Reads wallets from column A of your Google Sheet and returns { eligible: true | false }.
// The full list is never sent to the browser.

const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;
const CACHE_MS = 30 * 1000; // new wallets show up within ~30 seconds

let cache = { at: 0, wallets: new Set() };

async function loadWallets() {
  if (Date.now() - cache.at < CACHE_MS && cache.wallets.size) return cache.wallets;

  const { SHEET_ID, GOOGLE_API_KEY } = process.env;
  const range = process.env.SHEET_RANGE || "Sheet1!A:A";
  if (!SHEET_ID || !GOOGLE_API_KEY) throw new Error("Missing environment variables");

  const url =
    "https://sheets.googleapis.com/v4/spreadsheets/" + encodeURIComponent(SHEET_ID) +
    "/values/" + encodeURIComponent(range) +
    "?majorDimension=COLUMNS&key=" + encodeURIComponent(GOOGLE_API_KEY);

  const res = await fetch(url);
  if (!res.ok) throw new Error("Sheets API error " + res.status);
  const json = await res.json();

  const column = (json.values && json.values[0]) || [];
  const wallets = new Set(
    column.map((v) => String(v).trim().toLowerCase()).filter((v) => ADDRESS_RE.test(v))
  );

  cache = { at: Date.now(), wallets };
  return wallets;
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  const address = String((req.query && req.query.address) || "").trim();
  if (!ADDRESS_RE.test(address)) {
    return res.status(400).json({ error: "Invalid address" });
  }

  try {
    const wallets = await loadWallets();
    return res.status(200).json({ eligible: wallets.has(address.toLowerCase()) });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: "Lookup failed" });
  }
};
