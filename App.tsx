import React, { useEffect } from "react";
import { LogBox } from "react-native";
import AppContainer from "./src/components/App-Container";
import Navigator from "./src/";

const App = () => {
  useEffect(() => {
    LogBox.ignoreLogs([
      "In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.",
    ]);
  }, []);
  return (
    <AppContainer>
      <Navigator />
    </AppContainer>
  );
};

export default App;
