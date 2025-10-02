const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;
const BINGX_BASE = 'https://open-api.bingx.com';
const FUNDING_PATH = '/openApi/swap/v2/quote/fundingRate';

app.get('/funding', async (req, res) => {
  const symbol = (req.query.symbol || '').toUpperCase();
  if (!symbol) return res.status(400).json({ error: 'symbol required, e.g. ?symbol=BTCUSDT' });
  const url = `${BINGX_BASE}${FUNDING_PATH}?symbol=${encodeURIComponent(symbol)}`;

  try {
    const upstream = await fetch(url);
    const body = await upstream.text();
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.type('application/json').status(upstream.status).send(body);
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log(`Proxy running on :${PORT}`));
