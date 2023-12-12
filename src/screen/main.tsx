import * as React from "react";

import { Text, Box, VStack, useColorModeValue } from "native-base";
import ThemeToggle from "../components/themeToggle";
import AnimatedColorBox from "../components/animated-color";
import MastHeader from "../components/MastHedaer";
import Navbar from "../components/navbar";

export default function MainScreen() {
  return (
    <AnimatedColorBox
      bg={useColorModeValue("warmGray.50", "primary.900")}
      w="full"
      flex={1}
    >
      <MastHeader
        title="Hi welcome to Converted Currency App!"
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
      </VStack>
    </AnimatedColorBox>
  );
}
