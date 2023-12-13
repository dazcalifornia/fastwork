// ConvertScreen.js
import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";

import {
  Button,
  HStack,
  Text,
  Box,
  FlatList,
  VStack,
  useColorModeValue,
  Input,
  Avatar,
  Heading,
} from "native-base";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios from "axios";
import RNPickerSelect from "react-native-picker-select";
import { useCurrency } from "../../CurrencyContext";

import AnimatedColorBox from "../components/animated-color";
import MastHeader from "../components/MastHedaer";
import Navbar from "../components/navbar";

const ConvertScreen = ({ route }) => {
  const [currencies, setCurrencies] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [convertedValue, setConvertedValue] = useState([]);
  const [cryptCoverted, setCryptConvert] = useState([]);
  const [kanye, setKanye] = useState([]);
  const [west, setWest] = useState([]);
  const [allList, setAllList] = useState([]);

  const selectedCountry = route.params?.selectedCountries;
  const selectedCryptos = route.params?.selectedCryptos;

  const { selectedCurrency, setCurrency } = useCurrency();

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
    <AnimatedColorBox
      bg={useColorModeValue("warmGray.50", "primary.900")}
      w="full"
      flex={1}
    >
      <MastHeader
        title="Welcome to Converted Currency App!"
        image={require("../assets/2.jpeg")}
      >
        <Navbar />
      </MastHeader>
      <VStack
        flex={1}
        space={1}
        bg={useColorModeValue("warmGray.50", "primary.900")}
        mt="-20px"
        borderTopLeftRadius="20px"
        borderTopRightRadius="20px"
        pt="20px"
      >
        <Heading m={2}>
          Currency Converter{" "}
          <Text color="emerald.500">Select base Currency</Text>
        </Heading>
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

        <Box alignItems="center">
          <Input
            ml={2}
            mr={2}
            size="2xl"
            variant="rounded"
            value={inputValue}
            onChangeText={(text) => setInputValue(text)}
            InputRightElement={
              <Button
                colorScheme="success"
                rounded="none"
                h="full"
                onPress={handleConvert}
              >
                Convert
              </Button>
            }
            placeholder="Amount"
          />
        </Box>

        {/* Display selected country from CountrySelectScreen */}
        <Text>
          {route.params?.selectedCountry
            ? `Selected Country: ${route.params.selectedCountry.currencies[0].code}`
            : ""}
        </Text>
        {/* Display the list of selected currencies */}
        <FlatList
          data={allList}
          p={4}
          renderItem={({ item, index }) => (
            <VStack key={index} space={2} alignItems="center">
              {item.map((subItem, subIndex) => (
                <HStack
                  key={subIndex}
                  space={2}
                  alignItems="center"
                  justifyContent="space-between"
                  p={2}
                  w="full"
                  borderBottomWidth={1}
                  borderColor="gray.200"
                >
                  <Box>
                    <Avatar
                      source={{ uri: `${subItem.flags}` }}
                      size="md"
                      borderRadius={100}
                      mb={6}
                      borderColor="tertiary.100"
                      borderWidth={1}
                    />
                  </Box>
                  <Text>{`Converted  ${selectedCurrency} to ${subItem.code}: ${subItem.convertedValue}`}</Text>
                </HStack>
              ))}
            </VStack>
          )}
          ListEmptyComponent={() => <Text>No currencies selected</Text>}
        />
      </VStack>
    </AnimatedColorBox>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    margin: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 16,
    color: "black",
    paddingRight: 30,
    backgroundColor: "white",
    marginBottom: 20,
  },
});

export default ConvertScreen;
