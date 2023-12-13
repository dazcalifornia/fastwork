import * as React from "react";
import { TextInput } from "react-native";
import {
  Text,
  Box,
  VStack,
  Select,
  Icon,
  Stack,
  Input,
  useColorModeValue,
} from "native-base";
import ThemeToggle from "../components/themeToggle";
import AnimatedColorBox from "../components/animated-color";
import MastHeader from "../components/MastHedaer";
import Navbar from "../components/navbar";

export default function MainScreen() {
  let [language, setLanguage] = React.useState<string>("key0");
  return (
    <AnimatedColorBox
      bg={useColorModeValue("warmGray.50", "primary.900")}
      w="full"
      flex={1}
    >
      <MastHeader
        title="Welcome to Converted Currency App!"
        image={require("../assets/masthead.png")}
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
        <Box
          p={10}
          bg={useColorModeValue("red.500", "yellow.500")}
          w="full"
          alignItems="center"
        >
          <Text>hello</Text>
        </Box>
        <ThemeToggle />

        <TextInput
          placeholder="Age (Yr)"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType={"done"}
          keyboardType="numeric"
          multiline={false}
        />
        <Select
          placeholder="Mode of payment"
          selectedValue={language}
          width={150}
          onValueChange={(itemValue: string) => setLanguage(itemValue)}
        >
          <Select.Item label="Wallet" value="key0" />
          <Select.Item label="ATM Card" value="key1" />
          <Select.Item label="Debit Card" value="key2" />
          <Select.Item label="Credit Card" value="key3" />
          <Select.Item label="Net Banking" value="key4" />
        </Select>
        <Stack space={4} w="100%" maxW="300px" mx="auto">
          <Input variant="outline" placeholder="Outline" />
          <Input variant="filled" placeholder="Filled" />
          <Input variant="underlined" placeholder="Underlined" />
          <Input variant="unstyled" placeholder="Unstyled" />
          <Input variant="rounded" placeholder="Round" />
        </Stack>
      </VStack>
    </AnimatedColorBox>
  );
}
