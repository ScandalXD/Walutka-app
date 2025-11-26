const axios = require('axios');
require('dotenv').config();

const {
  PAYU_POS_ID,
  PAYU_CLIENT_ID,
  PAYU_CLIENT_SECRET,
  PAYU_SANDBOX_URL,
  PAYU_NOTIFY_URL,
  PAYU_RETURN_URL,
} = process.env;

async function getPayuAccessToken() {
  const url = `${PAYU_SANDBOX_URL}/pl/standard/user/oauth/authorize`;

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', PAYU_CLIENT_ID);
  params.append('client_secret', PAYU_CLIENT_SECRET);

  const response = await axios.post(url, params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  return response.data.access_token;
}

async function createPayuOrder(amountPln, description, customerEmail) {
  const accessToken = await getPayuAccessToken();

  const url = `${PAYU_SANDBOX_URL}/api/v2_1/orders`;
  const totalAmount = Math.round(amountPln * 100); 

  const body = {
    notifyUrl: PAYU_NOTIFY_URL,
    continueUrl: PAYU_RETURN_URL,
    customerIp: '127.0.0.1',
    merchantPosId: PAYU_POS_ID,
    description: description || 'Doładowanie konta walutowego',
    currencyCode: 'PLN',
    totalAmount: totalAmount.toString(),
    buyer: customerEmail
      ? {
          email: customerEmail,
        }
      : undefined,
    products: [
      {
        name: 'Doładowanie konta walutowego',
        unitPrice: totalAmount.toString(),
        quantity: '1',
      },
    ],
  };

  const response = await axios.post(url, body, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    maxRedirects: 0,
    validateStatus: (status) => status >= 200 && status < 400,
  });

  let redirectUri =
    response.data && typeof response.data === 'object'
      ? response.data.redirectUri
      : undefined;

  if (!redirectUri && response.headers && response.headers.location) {
    redirectUri = response.headers.location;
  }

  return {
    ...response.data,
    redirectUri,
  };
}

module.exports = {
  createPayuOrder,
};
