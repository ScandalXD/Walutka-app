const express = require('express');
const db = require('../db');
const auth = require('../middleware/authMiddleware');
const { getCurrentTableA } = require('../services/nbpService');

const router = express.Router();

// F4+F5: pobranie aktualnych kursów + zapis do DB + zwrot do klienta
router.get('/current', auth, async (req, res) => {
  try {
    const table = await getCurrentTableA();
    const effectiveDate = table.effectiveDate;

    // zapis do EXCHANGE_RATES 
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
    res.status(500).json({ message: 'Błąd pobierania kursów NBP' });
  }
});

// archiwalne kursy  EXCHANGE_RATES_HISTORY
router.get('/history/:code', auth, (req, res) => {
  const { code } = req.params;
  db.all(
    'SELECT currency_code, mid_rate, rate_date FROM EXCHANGE_RATES_HISTORY WHERE currency_code = ? ORDER BY rate_date DESC LIMIT 30',
    [code.toUpperCase()],
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      res.json(rows);
    }
  );
});

module.exports = router;
