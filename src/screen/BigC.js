import React from "react";
import {
  Box,
  HStack,
  Badge,
  ScrollView,
  Center,
  Divider,
  VStack,
  Heading,
  Text,
  Flex,
} from "native-base";

const Example = () => {
  const renderFlexItems = (direction) => (
    <Flex direction={direction} mb="2.5" mt="1.5">
      {[100, 200, 300, 400].map((value) => (
        <Center
          key={value}
          size="16"
          bg={`primary.${value}`}
          _text={{
            color: "coolGray.800",
          }}
        >
          {value}
        </Center>
      ))}
    </Flex>
  );

  return (
    <ScrollView>
      <VStack space={2.5} w="100%" px="3">
        <Heading size="md">row</Heading>
        {renderFlexItems("row")}
        <Divider />

        <Heading size="md">column</Heading>
        {renderFlexItems("column")}
        <Divider />

        <Heading size="md">row-reverse</Heading>
        {renderFlexItems("row-reverse")}
        <Divider />

        <Heading size="md">column-reverse</Heading>
        {renderFlexItems("column-reverse")}
        <Divider />
      </VStack>
    </ScrollView>
  );
};

const BigC = () => {
  return (
    <>
      <HStack space={4} mx="auto">
        {["success", "danger", "info", "coolGray"].map((colorScheme) => (
          <Badge key={colorScheme} colorScheme={colorScheme}>
            <Text>{colorScheme.toUpperCase()}</Text>
          </Badge>
        ))}
      </HStack>

      <Box>
        <Example />
      </Box>
    </>
  );
};

export default BigC;
