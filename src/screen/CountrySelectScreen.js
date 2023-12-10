import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import axios from "axios";

// New import statement
import AsyncStorage from "@react-native-async-storage/async-storage";

const CountrySelectScreen = ({ navigation, route }) => {
  const [countries, setCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);

  useEffect(() => {
    // Fetch the list of countries from cache or API
    const fetchCountries = async () => {
      try {
        const cachedCountries = await AsyncStorage.getItem("selectedCountries");
        if (cachedCountries) {
          setCountries(JSON.parse(cachedCountries));
        } else {
          const response = await axios.get("https://restcountries.com/v2/all");
          setCountries(response.data);
          // Update the storage key with the new package name
          await AsyncStorage.setItem(
            "selectedCountries",
            JSON.stringify(response.data)
          );
        }
      } catch (error) {
        console.error("Error fetching or saving countries:", error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    // Update the filtered countries when searchText changes
    const filtered = countries.filter((country) =>
      country.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredCountries(filtered);
  }, [searchText, countries]);

  const handleCountrySelect = (country) => {
    // Toggle the selection status of the country
    const isSelected = selectedCountries.some(
      (selected) => selected.alpha2Code === country.alpha2Code
    );
    if (isSelected) {
      // If already selected, remove from the list
      setSelectedCountries((prevSelected) =>
        prevSelected.filter(
          (selected) => selected.alpha2Code !== country.alpha2Code
        )
      );
    } else {
      // If not selected, add to the list
      setSelectedCountries((prevSelected) => [...prevSelected, country]);
    }
  };

  const renderCountryItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleCountrySelect(item)}>
      <View
        style={[
          styles.countryItem,
          {
            backgroundColor: selectedCountries.some(
              (selected) => selected.alpha2Code === item.alpha2Code
            )
              ? "#e0e0e0"
              : "white",
          },
        ]}
      >
        <Text>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleDone = () => {
    // Save selected countries to cache
    AsyncStorage.setItem(
      "selectedCountries",
      JSON.stringify(selectedCountries)
    );
    // Pass the selected countries back to the home screen
    navigation.navigate("Home", { selectedCountries });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search countries"
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />
      <FlatList
        data={filteredCountries}
        keyExtractor={(item) => item.alpha2Code}
        renderItem={renderCountryItem}
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
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  countryItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
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

export default CountrySelectScreen;
