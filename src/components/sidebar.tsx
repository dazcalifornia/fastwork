import React, { useCallback } from "react";
import {
  HStack,
  VStack,
  Center,
  Avatar,
  Heading,
  IconButton,
  useColorModeValue,
  Box,
} from "native-base";
import AnimatedColorBox from "./animated-color";
import ThemeToggle from "./themeToggle";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { Feather } from "@expo/vector-icons";
import MenuButton from "./menu-button";

const Sidebar = (props: DrawerContentComponentProps) => {
  const { state, navigation } = props;
  const currentRoute = state.routeNames[state.index];

  const handlePressBackButton = useCallback(() => {
    navigation.closeDrawer();
  }, [navigation]);

  const handlePressMenuCrypto = useCallback(() => {
    navigation.navigate("SelectCrypto");
  }, [navigation]);
  const handlePressMenuCountry = useCallback(() => {
    navigation.navigate("SelectCountry");
  }, [navigation]);
  const handlePressMenuHome = useCallback(() => {
    navigation.navigate("Home");
  }, [navigation]);

  const handlePressMenuMain = useCallback(() => {
    navigation.navigate("Main");
  }, [navigation]);
  const handlePressMenuCrypt = useCallback(() => {
    navigation.navigate("Crypt");
  }, [navigation]);
  const handlePressMenuCurr = useCallback(() => {
    navigation.navigate("Curr");
  }, [navigation]);

  return (
    <AnimatedColorBox
      safeArea
      flex={1}
      bg={useColorModeValue("blue.50", "darkBlue.800")}
      p={7}
    >
      <VStack flex={1} space={2}>
        <HStack justifyContent="flex-end">
          <IconButton
            onPress={handlePressBackButton}
            borderRadius={100}
            variant="outline"
            borderColor={useColorModeValue("blue.300", "darkBlue.700")}
            _icon={{
              as: Feather,
              name: "chevron-left",
              size: 6,
              color: useColorModeValue("blue.800", "darkBlue.700"),
            }}
          />
        </HStack>
        <Avatar
          source={require("../assets/4.png")}
          size="xl"
          borderRadius={100}
          mb={6}
          borderColor="secondary.500"
          borderWidth={3}
        />
        <Heading mb={4} size="xl">
          Currency convert Application
        </Heading>
        <MenuButton
          active={currentRoute === "Home"}
          onPress={handlePressMenuHome}
          icon="home"
        >
          Home
        </MenuButton>
        <MenuButton
          active={currentRoute === "SelectCrypto"}
          onPress={handlePressMenuCrypto}
          icon="codesandbox"
        >
          Select Crypto
        </MenuButton>
        <MenuButton
          active={currentRoute === "SelectCountry"}
          onPress={handlePressMenuCountry}
          icon="globe"
        >
          Select Country
        </MenuButton>
        <MenuButton
          active={currentRoute === "Main"}
          onPress={handlePressMenuMain}
          icon="globe"
        >
          Franx
        </MenuButton>
        <MenuButton
          active={currentRoute === "Crypt"}
          onPress={handlePressMenuCrypt}
          icon="globe"
        >
          Franx Crypt
        </MenuButton>
        <MenuButton
          active={currentRoute === "Curr"}
          onPress={handlePressMenuCurr}
          icon="globe"
        >
          Franx Curr
        </MenuButton>
      </VStack>
      <Center>
        <ThemeToggle />
      </Center>
    </AnimatedColorBox>
  );
};

export default Sidebar;
