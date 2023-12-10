import React, { useEffect } from "react";
import { LogBox } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
import ConvertScreen from "./src/screen/ConvertScreen";
import CountrySelectScreen from "./src/screen/CountrySelectScreen";
import CryptoSelectScreen from "./src/screen/CryptoSelectScreen";
import BigC from "./src/screen/BigC";

const Drawer = createDrawerNavigator();

const App = () => {
  useEffect(() => {
    LogBox.ignoreLogs([
      "In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.",
    ]);
  }, []);
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={ConvertScreen} />
          <Drawer.Screen name="SelectCountry" component={CountrySelectScreen} />
          <Drawer.Screen name="SelectCrypto" component={CryptoSelectScreen} />
          <Drawer.Screen name="Franx" component={BigC} />
        </Drawer.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default App;
