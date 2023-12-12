// ConvertScreen.js
import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet } from "react-native";

import {
  Button,
  HStack,
  Text,
  Box,
  Image,
  FlatList,
  Heading,
  Avatar,
  VStack,
  Spacer,
} from "native-base";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios from "axios";
import RNPickerSelect from "react-native-picker-select";
import { useNavigation } from "@react-navigation/native";
import { useCurrency } from "../../CurrencyContext";
const theme = createTheme();

const ConvertScreen = ({ route }) => {
  const [currencies, setCurrencies] = useState([]);
  //const [selectedCurrency, setSelectedCurrency] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [convertedValue, setConvertedValue] = useState([]);
  const [cryptCoverted, setCryptConvert] = useState([]);
  const selectedCountry = route.params?.selectedCountries;
  const [kanye, setKanye] = useState([]);
  const [west, setWest] = useState([]);
  const [allList, setAllList] = useState([]);

  const selectedCryptos = route.params?.selectedCryptos;

  const { selectedCurrency, setCurrency } = useCurrency();

  const navigation = useNavigation();

  const handleNavigateToCryptoSelect = () => {
    navigation.navigate("SelectCrypto", {
      selectedCurrency,
    });
  };

  useEffect(() => {
    if (selectedCryptos) {
      setWest([]);
      selectedCryptos.forEach((crypto) => {
        setWest((prev) => [
          ...prev,
          {
            name: crypto.name,
            code: crypto.symbol,
            image: crypto.image,
            id: crypto.id,
          },
        ]);
        console.log(`${crypto.name}: ${crypto.id}`);
      });
    }
    if (selectedCountry) {
      setKanye([]);

      selectedCountry.forEach((country) => {
        console.log("contry:=>", country);
        const currencyCode = country;
        setKanye((prevKanye) => [
          ...prevKanye,
          {
            name: country.name,
            code: country.currencies[0].code,
            flag: country.flags.png,
          },
        ]);
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
      })
      .catch((error) => console.error("Error fetching currencies:", error));
  }, []);

  const handleCrypto = () => {};

  const handleConvert = async () => {
    try {
      if (!inputValue || isNaN(inputValue)) {
        alert("Please enter a valid numeric value");
        return;
      }

      if (!selectedCurrency) {
        alert("Please select a currency");
        return;
      }

      // Fetch the conversion rate for the selected currency
      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/${selectedCurrency}`
      );
      const newSelectedCurrencies = await Promise.all(
        kanye.map(async (currency) => {
          const conversionRate = response.data.rates[currency.code];
          if (!conversionRate) {
            alert("Conversion rate not available for the selected currency");
            return null;
          }
          const convertedValue = (inputValue * conversionRate).toFixed(2);
          return {
            code: currency.code,
            convertedValue,
            flags: currency.flag,
          };
        })
      );

      setConvertedValue(newSelectedCurrencies);

      if (!inputValue || isNaN(inputValue) || !selectedCurrency) {
        alert("Please enter a valid numeric value and select a currency");
        return;
      }

      const cryptoConvertPromises = west.map(async (crypto) => {
        try {
          const cryptoResponse = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price?ids=${crypto.id}&vs_currencies=${selectedCurrency}`
          );

          const conversionRate = cryptoResponse.data[crypto.id];
          const k = Object.keys(conversionRate)[0];
          const convertedValue = (inputValue * conversionRate[k]).toFixed(2);

          return { code: crypto.name, convertedValue, flags: crypto.image };
        } catch (error) {
          console.error("Error fetching conversion rate:", error);
          alert("An error occurred while fetching conversion rate");
          return null;
        }
      });

      const cryptoConvertedResults = await Promise.all(cryptoConvertPromises);
      setCryptConvert(cryptoConvertedResults);
      setAllList([cryptoConvertedResults, newSelectedCurrencies]);
    } catch (error) {
      console.error("Error fetching conversion rate:", error);
      alert("An error occurred while fetching conversion rate");
    }
  };

  const handleCurrencyChange = (value) => {
    setCurrency(value);
  };

  return (
    <ThemeProvider theme={theme}>
      <View style={styles.container}>
        <Button onPress={() => console.log(allList)}>
          <Text>Logger</Text>
        </Button>
        <Text style={styles.header}>Currency Converter</Text>
        <RNPickerSelect
          placeholder={{ label: "Select Currency", value: null }}
          items={currencies.map((currency) => ({
            label: currency,
            value: currency,
          }))}
          onValueChange={handleCurrencyChange}
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
          data={allList}
          renderItem={({ item, index }) => (
            <VStack key={index} space={2} alignItems="center">
              {item.map((subItem, subIndex) => (
                <HStack
                  key={subIndex}
                  space={2}
                  alignItems="center"
                  justifyContent="space-between"
                  p={2}
                  borderBottomWidth={1}
                  borderColor="gray.200"
                >
                  <Box>
                    <Image
                      alt="flags"
                      source={{ uri: `${subItem.flags}` }} // Replace with the actual property that holds the image URL
                      size="xs"
                    />
                  </Box>
                  <Text>{`Converted value in ${selectedCurrency} to ${subItem.code}: ${subItem.convertedValue}`}</Text>
                </HStack>
              ))}
            </VStack>
          )}
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
