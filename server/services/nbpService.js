const axios = require('axios');

// tabela A – średnie kursy
const BASE_URL = 'https://api.nbp.pl/api/exchangerates';

async function getCurrentTableA() {
  const url = `${BASE_URL}/tables/A/?format=json`;
  const res = await axios.get(url);
  return res.data[0]; // { table, no, effectiveDate, rates: [...] }
}

module.exports = { getCurrentTableA };
