import React, { useEffect, useState } from "react";
import { TouchableOpacity, TextInput } from "react-native";
import {
  VStack,
  Text,
  useColorModeValue,
  FlatList,
  View,
  Button,
} from "native-base";
import axios from "axios";
import AnimatedColorBox from "../components/animated-color";
import MastHeader from "../components/MastHedaer";
import Navbar from "../components/navbar";
import { useCurrency } from "../../CurrencyContext";

export default function MainScreen() {
  const { selectedCryptos, selectedCountries } = useCurrency();
  const [inputValues, setInputValues] = useState({});
  const [kanye, setKanye] = useState([]);
  const [west, setWest] = useState([]);
  const [allList, setAllList] = useState([]);

  useEffect(() => {
    if (selectedCryptos) {
      setWest(
        selectedCryptos.map((crypto) => ({
          name: crypto.name,
          code: crypto.symbol,
          image: crypto.image,
          id: crypto.id,
        }))
      );
    }
    if (selectedCountries) {
      setKanye(
        selectedCountries.map((country) => ({
          name: country.name,
          code: country.currencies[0].code,
          flag: country.flags.png,
        }))
      );
    }
    setAllList([kanye, west]);
  }, [selectedCountries, selectedCryptos]);

  const handleInputChange = async (key, value) => {
    console.log("handleInput", key, value);
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [key]: value,
      [`currency_${key}`]:
        selectedCountries.find((country) => country.code === key)?.currencies[0]
          ?.code || "",
    }));
    try {
      // Fetch the conversion rate for the selected currency
      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/${key}`
      );
      const newSelectedCurrencies = await Promise.all(
        kanye.map(async (currency) => {
          const conversionRate = response.data.rates[currency.code];
          if (!conversionRate) {
            alert("Conversion rate not available for the selected currency");
            return null;
          }
          const convertedValue = (inputValues * conversionRate).toFixed(2);
          return {
            code: currency.code,
            convertedValue,
            flags: currency.flag,
          };
        })
      );

      setConvertedValue(newSelectedCurrencies);

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

  return (
    <AnimatedColorBox
      bg={useColorModeValue("warmGray.50", "primary.900")}
      w="full"
      flex={1}
    >
      <MastHeader title="Franx" image={require("../assets/4.png")}>
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
        <Button onPress={() => console.log(selectedCryptos)}>
          <Text>selectedCryptos</Text>
        </Button>

        <Button onPress={() => console.log(selectedCountries)}>
          <Text>selectedCountries</Text>
        </Button>
        <Button onPress={() => console.log(allList)}>
          <Text>input</Text>
        </Button>

        {renderItem(west, "id")}
        {renderItem(kanye, "name")}
      </VStack>
    </AnimatedColorBox>
  );

  function renderItem(data, keyExtractor) {
    return (
      <FlatList
        data={data}
        keyExtractor={(item) => item[keyExtractor].toString()}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 15,
                borderBottomWidth: 1,
                borderBottomColor: "#ccc",
              }}
            >
              <Text color="black">{item.name}</Text>
              <TextInput
                placeholder="Type here"
                style={{ borderWidth: 1, padding: 8, marginLeft: 8 }}
                onChangeText={(text) =>
                  handleInputChange(item[keyExtractor], text)
                }
                value={inputValues[item[keyExtractor]] || ""}
              />
            </View>
          </TouchableOpacity>
        )}
      />
    );
  }
}
