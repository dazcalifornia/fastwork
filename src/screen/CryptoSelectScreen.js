// CryptoSelectScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";

const CryptoSelectScreen = ({ navigation }) => {
  const [cryptos, setCryptos] = useState([]);
  const [filteredCryptos, setFilteredCryptos] = useState([]);
  const [selectedCryptos, setSelectedCryptos] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    // Fetch the list of cryptocurrencies (You may use a crypto API for this)
    // For example, using CoinGecko API
    fetch("https://api.coingecko.com/api/v3/coins/list")
      .then((response) => response.json())
      .then((data) => {
        setCryptos(data);
        setFilteredCryptos(data);
      })
      .catch((error) =>
        console.error("Error fetching cryptocurrencies:", error)
      );
  }, []);

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

  const renderCryptoItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleCryptoSelect(item)}>
      <View
        style={[
          styles.cryptoItem,
          {
            backgroundColor: selectedCryptos.some(
              (selected) => selected.id === item.id
            )
              ? "#e0e0e0"
              : "white",
          },
        ]}
      >
        <Text>
          {item.name} ({item.symbol})
        </Text>
      </View>
    </TouchableOpacity>
  );

  const handleDone = () => {
    console.log("passing Crypto:", selectedCryptos);
    // Pass the selected cryptocurrencies back to the home screen
    navigation.navigate("Home", { selectedCryptos });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Cryptos"
        onChangeText={handleSearch}
        value={searchText}
      />
      <FlatList
        data={filteredCryptos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCryptoItem}
      />
      <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  cryptoItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  doneButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#4caf50",
    alignItems: "center",
    borderRadius: 5,
  },
  doneButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default CryptoSelectScreen;
