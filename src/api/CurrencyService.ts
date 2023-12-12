// CurrencyService.js
import axios from "axios";

const Currencies_Url = "https://api.exchangerate-api.com/v4/latest/USD";
const CryptoCurrencies_URL = "https://api.coingecko.com/api/v3/simple/price";

const getCurrencyRates = async () => {
  try {
    const response = await axios.get(Currencies_Url);
    return response.data.rates;
  } catch (error) {
    console.error("Error fetching currencies:", error);
    throw error;
  }
};

const getCryptocurrencyRates = async (cryptoCurrencies, selectedCurrency) => {
  console.log(selectedCurrency);
  try {
    const ids = cryptoCurrencies.join(",");
    const response = await axios.get(
      `${CryptoCurrencies_URL}?ids=${ids}&vs_currencies=${selectedCurrency}`
    );
    console.log("Cryptocurrency API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching cryptocurrency rates:", error);
    throw error;
  }
};

export { getCurrencyRates, getCryptocurrencyRates };
