// ConvertScreen.js
import React, { useState, useEffect } from "react";
import { View, TextInput, FlatList, StyleSheet } from "react-native";

import { Button, HStack, Text, Box, Image } from "native-base";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios from "axios";
import RNPickerSelect from "react-native-picker-select";

const theme = createTheme();

const ConvertScreen = ({ route }) => {
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [convertedValue, setConvertedValue] = useState([]);
  const [cryptCoverted, setCryptConvert] = useState([]);
  const selectedCountry = route.params?.selectedCountries;
  const [kanye, setKanye] = useState([]);
  const [west, setWest] = useState([]);

  const selectedCryptos = route.params?.selectedCryptos;

  useEffect(() => {
    if (selectedCryptos) {
      setWest([]);
      selectedCryptos.forEach((crypto) => {
        const currencyCode = crypto.id; // Assuming there's only one currency per country
        setWest((prev) => [...prev, currencyCode]);
        console.log(`${crypto.name}: ${currencyCode}`);
      });
    }
    if (selectedCountry) {
      setKanye([]);
      selectedCountry.forEach((country) => {
        console.log("contry:=>", country);
        const currencyCode = country;
        setKanye((prevKanye) => [...prevKanye, currencyCode]);
        console.log(`${country.name}: ${currencyCode}`);
      });
    }
  }, [selectedCountry, selectedCryptos]);

  useEffect(() => {
    // Fetch the list of currencies
    axios
      .get("https://api.exchangerate-api.com/v4/latest/USD")
      .then((response) => {
        const currencyList = Object.keys(response.data.rates);
        setCurrencies(currencyList);
        setSelectedCurrency(currencyList[0]); // Set default currency
      })
      .catch((error) => console.error("Error fetching currencies:", error));
  }, []);

  const handleCrypto = () => {
    if (!inputValue || isNaN(inputValue)) {
      alert("Please enter a valid numeric value");
      return;
    }

    if (!selectedCurrency) {
      alert("Please select a currency");
      return;
    }
    setCryptConvert([]);
    west.forEach((crypto) => {
      axios
        .get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${selectedCurrency}`
        )
        .then((response) => {
          console.log("Response:", response.data);

          // Extract the conversion rate for the selected currency
          const conversionRate = response.data[crypto];
          const k = Object.keys(conversionRate)[0];
          console.log("Conversion Rate:", conversionRate[k]);

          // Calculate the converted value
          const convertedValue = (inputValue * conversionRate[k]).toFixed(2);

          // Update the state with the converted value for the current cryptocurrency
          setCryptConvert((prevCryptConvert) => [
            ...prevCryptConvert,
            { code: crypto, convertedValue },
          ]);
        })
        .catch((error) => {
          console.error("Error fetching conversion rate:", error);
          alert("An error occurred while fetching conversion rate");
        });
    });
  };

  const handleConvert = () => {
    if (!inputValue || isNaN(inputValue)) {
      alert("Please enter a valid numeric value");
      return;
    }

    if (!selectedCurrency) {
      alert("Please select a currency");
      return;
    }

    // Fetch the conversion rate for the selected currency
    axios
      .get(`https://api.exchangerate-api.com/v4/latest/${selectedCurrency}`)
      .then((response) => {
        const newSelectedCurrencies = kanye.map((currency) => {
          const conversionRate =
            response.data.rates[currency.currencies[0].code];
          if (!conversionRate) {
            alert("Conversion rate not available for the selected currency");
            return null;
          }
          const convertedValue = (inputValue * conversionRate).toFixed(2);
          return {
            code: currency.currencies[0].code,
            convertedValue,
            flags: currency.flag,
          };
        });

        setConvertedValue(newSelectedCurrencies);
        handleCrypto();
      })
      .catch((error) => {
        console.error("Error fetching conversion rate:", error);
        alert("An error occurred while fetching conversion rate");
      });
  };

  const renderSelectedCurrencies = ({ item }) => (
    <View style={styles.selectedCurrencyItem}>
      <Text>{`Converted value in ${selectedCurrency} to ${item.code}: ${item.convertedValue}`}</Text>
    </View>
  );

  const renderCurrencyItem = ({ item }) => {
    console.log(item);
    return (
      <HStack
        space={2}
        alignItems="center"
        justifyContent="space-between"
        p={2}
        borderBottomWidth={1}
        borderColor="gray.200"
      >
        <Box>
          {/* Check if the item is a country or crypto and render the appropriate image */}
          {selectedCountry ? (
            <Image
              alt="flags"
              source={{ uri: `${item.flags}` }} // Replace with the actual property that holds the country flag URL
              style={{ width: 70, height: 50 }}
            />
          ) : (
            <Image
              alt="crypto"
              source={{ uri: item.image_url }} // Replace with the actual property that holds the crypto image URL
              style={{ width: 70, height: 50 }}
            />
          )}
        </Box>
        <Text>{`Converted value in ${selectedCurrency} to ${item.code}: ${item.convertedValue}`}</Text>
      </HStack>
    );
  };
  return (
    <ThemeProvider theme={theme}>
      <View style={styles.container}>
        <Text style={styles.header}>Currency Converter</Text>

        <RNPickerSelect
          placeholder={{ label: "Select Currency", value: null }}
          items={currencies.map((currency) => ({
            label: currency,
            value: currency,
          }))}
          onValueChange={(value) => setSelectedCurrency(value)}
          value={selectedCurrency}
          style={pickerSelectStyles}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter value"
          keyboardType="numeric"
          value={inputValue}
          onChangeText={(text) => setInputValue(text)}
        />
        <Button title="Convert" onPress={handleConvert}>
          <Text>Convert</Text>
        </Button>

        {/* Display selected country from CountrySelectScreen */}
        <Text style={styles.resultText}>
          {route.params?.selectedCountry
            ? `Selected Country: ${route.params.selectedCountry.currencies[0].code}`
            : ""}
        </Text>
        {/* Display the list of selected currencies */}
        <FlatList
          data={convertedValue}
          keyExtractor={(item) => item.code}
          renderItem={renderCurrencyItem}
          ListEmptyComponent={() => <Text>No currencies selected</Text>}
        />
        <FlatList
          data={cryptCoverted}
          keyExtractor={(item) => item.code}
          renderItem={renderSelectedCurrencies}
          ListEmptyComponent={() => <Text>No currencies selected</Text>}
        />
      </View>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    width: "100%",
  },
  resultText: {
    marginTop: 20,
    fontSize: 16,
  },
  selectedCurrencyItem: {
    marginTop: 10,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30,
    backgroundColor: "white",
    width: "100%",
    marginBottom: 20,
  },
});

export default ConvertScreen;
