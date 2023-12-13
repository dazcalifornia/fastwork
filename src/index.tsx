import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import SideBar from "./components/sidebar";

import MainScreen from "./screen/main";
import ConvertScreen from "./screen/ConvertScreen";
import CountrySelectScreen from "./screen/CountrySelectScreen";
import CryptoSelectScreen from "./screen/CryptoSelectScreen";
import BigC from "./screen/BigC";

import { CurrencyProvider } from "../CurrencyContext";

const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <CurrencyProvider>
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={(props) => <SideBar {...props} />}
        screenOptions={{
          headerShown: false,
          drawerType: "back",

          overlayColor: "#00000000",
        }}
      >
        <Drawer.Screen name="Home" component={ConvertScreen} />
        <Drawer.Screen name="countrySelect" component={CountrySelectScreen} />
        <Drawer.Screen name="SelectCountry" component={CountrySelectScreen} />
        <Drawer.Screen name="SelectCrypto" component={CryptoSelectScreen} />
      </Drawer.Navigator>
    </CurrencyProvider>
  );
};
export default App;
