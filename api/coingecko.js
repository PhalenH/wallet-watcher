import fetch from "node-fetch";

const COIN_GECKO_API =
  "https://api.coingecko.com/api/v3/coins/list?include_platform=true";

// const COIN_GECKO_250 =
//   "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=1000&page=1";

export default async function handler(request, response) {
  const res = await fetch(COIN_GECKO_API);
  // const res250 = await fetch(COIN_GECKO_250)

  if (res.ok) {
    const json = await res.json();
    response.status(200).json({ body: json });
  } else {
    response.status(res.status).end(res.body);
  }
  // if (res250.ok) {
  //   const json = await res250.json();
  //   response.status(200).json({ body: json });
  // } else {
  //   response.status(res.status).end(res.body);
  // }
}

