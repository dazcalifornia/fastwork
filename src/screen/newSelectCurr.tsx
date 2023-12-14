import React, { useState, useEffect } from "react";
import { TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import {
  Text,
  Box,
  VStack,
  Select,
  Icon,
  Stack,
  Input,
  FlatList,
  useColorModeValue,
} from "native-base";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AnimatedColorBox from "../components/animated-color";
import MastHeader from "../components/MastHedaer";
import Navbar from "../components/navbar";

import { useCurrency } from "../../CurrencyContext";

export default function SelectCurr() {
  const [countries, setCountrie] = useState([]);
  const [selectedCountrie, setSelectedCountries] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);
  const { setCountries, selectedCountries } = useCurrency();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const cachedCountries = await AsyncStorage.getItem("allCountries");
        if (cachedCountries) {
          setCountrie(JSON.parse(cachedCountries));
        } else {
          const response = await axios.get("https://restcountries.com/v2/all");
          setCountrie(response.data);
          await AsyncStorage.setItem(
            "allCountries",
            JSON.stringify(response.data)
          );
        }
      } catch (error) {
        console.error("Error fetching or saving countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const handleCountrySelect = (country) => {
    const isSelected = selectedCountries.some(
      (selected) => selected.alpha2Code === country.alpha2Code
    );

    if (isSelected) {
      setCountries((prevSelected) =>
        prevSelected.filter(
          (selected) => selected.alpha2Code !== country.alpha2Code
        )
      );
    } else {
      setCountries((prevSelected) => [...prevSelected, country]);
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

  return (
    <AnimatedColorBox
      bg={useColorModeValue("warmGray.50", "primary.900")}
      w="full"
      flex={1}
    >
      <MastHeader title="SelectCurr" image={require("../assets/4.png")}>
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
        <FlatList
          data={searchText ? filteredCountries : countries}
          keyExtractor={(item) => item.alpha2Code}
          renderItem={renderCountryItem}
        />
      </VStack>
    </AnimatedColorBox>
  );
}

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
    marginBottom: 20,
    backgroundColor: "#4caf50",
    alignItems: "center",
    borderRadius: 5,
  },
  doneButtonText: {
    color: "white",
    fontSize: 16,
  },
});
