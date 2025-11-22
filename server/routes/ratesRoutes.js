const express = require('express');
const db = require('../db');
const auth = require('../middleware/authMiddleware');
const axios = require('axios');

const router = express.Router();

// F4/F5: aktualne kursy – tabela A z NBP
router.get('/current', auth, async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.nbp.pl/api/exchangerates/tables/A/?format=json'
    );
    const table = response.data[0];
    const effectiveDate = table.effectiveDate;

    // zapis do EXCHANGE_RATES (prosto: kasujemy i wstawiamy)
    db.serialize(() => {
      db.run('DELETE FROM EXCHANGE_RATES');
      const stmt = db.prepare(
        'INSERT INTO EXCHANGE_RATES (currency_code, mid_rate, effective_date) VALUES (?, ?, ?)'
      );
      table.rates.forEach((r) => {
        stmt.run(r.code, r.mid, effectiveDate);
      });
      stmt.finalize();
    });

    res.json(table);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Błąd pobierania kursów NBP' });
  }
});

// 🔥 F5: archiwalne kursy jednej waluty
router.get('/history/:code', auth, async (req, res) => {
  const code = req.params.code.toUpperCase();

  try {
    // pobieramy ostatnie 10 notowań z NBP
    const response = await axios.get(
      `https://api.nbp.pl/api/exchangerates/rates/A/${code}/last/10/?format=json`
    );

    const data = response.data; // { code, currency, rates: [ { effectiveDate, mid }, ... ] }

    // zapisujemy do EXCHANGE_RATES_HISTORY (opcjonalnie, ale ładnie wygląda w projekcie)
    db.serialize(() => {
      const stmt = db.prepare(
        'INSERT INTO EXCHANGE_RATES_HISTORY (currency_code, mid_rate, rate_date) VALUES (?, ?, ?)'
      );
      data.rates.forEach((r) => {
        stmt.run(code, r.mid, r.effectiveDate);
      });
      stmt.finalize();
    });

    // zwracamy po prostu то, что вернул NBP
    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Błąd pobierania archiwalnych kursów' });
  }
});

module.exports = router;
