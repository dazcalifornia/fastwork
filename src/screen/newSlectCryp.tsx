import React, { useState, useEffect } from "react";
import { Text, VStack, Button, FlatList } from "native-base";
import { TouchableOpacity, View } from "react-native";
import AnimatedColorBox from "../components/animated-color";
import MastHeader from "../components/MastHedaer";
import Navbar from "../components/navbar";
import { useCurrency } from "../../CurrencyContext"; // Update this import path

export default function SelectCrypt() {
  const [cryptos, setCrypto] = useState([]);
  const [filteredCryptos, setFilteredCryptos] = useState([]);
  const [selectedCrypto, setSelectedCryptos] = useState([]);
  const [searchText, setSearchText] = useState("");
  const { setCryptos, selectedCryptos } = useCurrency(); // Access setCurrency and setCryptos functions from the context

  useEffect(() => {
    fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en`
    )
      .then((response) => response.json())
      .then((data) => {
        setCrypto(data);
        setFilteredCryptos(data);
      })
      .catch((error) => {
        console.error("Error fetching cryptocurrencies:", error);
      });
  }, []);

  const handleCryptoSelect = (crypto) => {
    // Toggle the selection status of the cryptocurrency
    const isSelected = selectedCryptos.some(
      (selected) => selected.id === crypto.id
    );

    if (isSelected) {
      // If already selected, remove from the list
      setCryptos((prevSelected) =>
        prevSelected.filter((selected) => selected.id !== crypto.id)
      );
    } else {
      // If not selected, add to the list
      setCryptos((prevSelected) => [...prevSelected, crypto]);
    }
  };

  return (
    <AnimatedColorBox bg="warmGray.50" w="full" flex={1}>
      <MastHeader title="SelectCrypt" image={require("../assets/4.png")}>
        <Navbar />
      </MastHeader>

      <VStack
        flex={1}
        space={1}
        bg="warmGray.50"
        mt="-20px"
        borderTopLeftRadius="20px"
        borderTopRightRadius="20px"
        pt="20px"
      >
        <Button onPress={() => console.log(cryptos)}>
          <Text>hi</Text>
        </Button>

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
      </VStack>
    </AnimatedColorBox>
  );
}
