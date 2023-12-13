import React, { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity, TextInput } from "react-native";
import {
  Button,
  useColorModeValue,
  VStack,
  Box,
  Text,
  StatusBar,
  Icon,
  Input,
} from "native-base";

import { Feather } from "@expo/vector-icons";
import { useCurrency } from "../../CurrencyContext";
import AnimatedColorBox from "../components/animated-color";
import MastHeader from "../components/MastHedaer";
import Navbar from "../components/navbar";

const CryptoSelectScreen = ({ navigation, route }) => {
  const [cryptos, setCryptos] = useState([]);
  const [filteredCryptos, setFilteredCryptos] = useState([]);
  const [selectedCryptos, setSelectedCryptos] = useState([]);
  const [searchText, setSearchText] = useState("");
  const { selectedCurrency } = useCurrency();

  useEffect(() => {
    if (selectedCurrency !== null) {
      fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${selectedCurrency}&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en`
      )
        .then((response) => {
          // Check if the response status is 429 (Too Many Requests)
          if (response.status === 429) {
            alert("Too Many Requests. Please try again later.");
            throw new Error("Too Many Requests");
          }
          return response.json();
        })
        .then((data) => {
          setCryptos(data);
          setFilteredCryptos(data);
        })
        .catch((error) => {
          // The error has already been handled for status 429, so log other errors
          if (error.message !== "Too Many Requests") {
            console.error("Error fetching cryptocurrencies:", error);
          }
        });
    }
  }, [selectedCurrency]);

  const handleCryptoSelect = (crypto) => {
    // Toggle the selection status of the cryptocurrency
    const isSelected = selectedCryptos.some(
      (selected) => selected.id === crypto.id
    );

    if (isSelected) {
      // If already selected, remove from the list
      setSelectedCryptos((prevSelected) =>
        prevSelected.filter((selected) => selected.id !== crypto.id)
      );
    } else {
      // If not selected, add to the list
      setSelectedCryptos((prevSelected) => [...prevSelected, crypto]);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    const filteredList = cryptos.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(text.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCryptos(filteredList);
  };

  const handleDone = () => {
    console.log("passing Crypto:", selectedCryptos);
    // Pass the selected cryptocurrencies back to the home screen
    navigation.navigate("Home", { selectedCryptos });
  };

  return (
    <AnimatedColorBox
      bg={useColorModeValue("warmGray.50", "primary.900")}
      w="full"
      flex={1}
    >
      <MastHeader title="Crypto Selection" image={require("../assets/5.jpeg")}>
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
        {selectedCurrency ? (
          <>
            <Input
              w="100%"
              size="xl"
              returnKeyType={"done"}
              value={searchText}
              onChangeText={handleSearch}
              InputLeftElement={
                <Icon
                  as={<Feather name="globe" />}
                  size={5}
                  ml="2"
                  color="muted.400"
                />
              }
              placeholder="Search Country"
            />
            <FlatList
              data={filteredCryptos}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleCryptoSelect(item)}>
                  <View
                    style={{
                      padding: 15,
                      borderBottomWidth: 1,
                      borderBottomColor: "#ccc",
                      backgroundColor: selectedCryptos.some(
                        (selected) => selected.id === item.id
                      )
                        ? "#e0e0e0"
                        : "white",
                    }}
                  >
                    <Text color="black">
                      {item.name} ({item.symbol})
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={{
                marginTop: 20,
                padding: 15,
                marginBottom: 20,
                backgroundColor: "#4caf50",
                alignItems: "center",
                borderRadius: 5,
              }}
              onPress={handleDone}
            >
              <Text style={{ color: "white", fontSize: 16 }}>Done</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Box>
            <Button
              colorScheme="success"
              onPress={() => navigation.navigate("Home")}
            >
              Go to Convert page
            </Button>
            <Text> please Select base Currency</Text>
          </Box>
        )}
      </VStack>
      <StatusBar />
    </AnimatedColorBox>
  );
};

export default CryptoSelectScreen;
