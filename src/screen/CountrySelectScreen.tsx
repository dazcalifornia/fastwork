import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import {
  Button,
  useColorModeValue,
  VStack,
  Icon,
  Input,
  HStack,
  Spacer,
  Box,
  Avatar,
} from "native-base";

import { Feather } from "@expo/vector-icons";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AnimatedColorBox from "../components/animated-color";
import MastHeader from "../components/MastHedaer";
import Navbar from "../components/navbar";

const CountrySelectScreen = ({ navigation, route }) => {
  const [countries, setCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const cachedCountries = await AsyncStorage.getItem("allCountries");
        if (cachedCountries) {
          setCountries(JSON.parse(cachedCountries));
        } else {
          const response = await axios.get("https://restcountries.com/v2/all");
          setCountries(response.data);
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

  useEffect(() => {
    const filtered = countries.filter((country) =>
      country.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredCountries(filtered);
  }, [searchText, countries]);

  const handleCountrySelect = (country) => {
    const isSelected = selectedCountries.some(
      (selected) => selected.alpha2Code === country.alpha2Code
    );

    if (isSelected) {
      setSelectedCountries((prevSelected) =>
        prevSelected.filter(
          (selected) => selected.alpha2Code !== country.alpha2Code
        )
      );
    } else {
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
    navigation.navigate("Home", { selectedCountries });
  };

  return (
    <AnimatedColorBox
      bg={useColorModeValue("warmGray.50", "primary.900")}
      w="full"
      flex={1}
    >
      <MastHeader
        title="Currency Selection"
        image={require("../assets/1.jpeg")}
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
        <Input
          m={4}
          size="xl"
          returnKeyType={"done"}
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          InputLeftElement={
            <Icon
              as={<Feather name="globe" />}
              size={5}
              m="2"
              color="muted.400"
            />
          }
          placeholder="Search Country"
        />
        <FlatList
          data={searchText ? filteredCountries : countries}
          keyExtractor={(item) => item.alpha2Code}
          renderItem={renderCountryItem}
        />

        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
        <StatusBar />
      </VStack>
    </AnimatedColorBox>
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

export default CountrySelectScreen;
