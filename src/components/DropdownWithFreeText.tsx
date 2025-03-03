import { useState } from "react";
import {
  Input,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  VStack,
} from "@chakra-ui/react";
import { v4 as uuidv4 } from "uuid";

interface Props {
  label: string;
  labelArray: string[];
  setValue: (s: string) => void;
}
export const DropdownWithFreeText: React.FC<Props> = ({
  label,
  labelArray,
  setValue,
}) => {
  const [selectedValue, setSelectedValue] = useState("");
  const [textInputValue, setTextInputValue] = useState("");

  const handleChange = (val) => {
    setSelectedValue(val);

    if (val === "other") {
      setTextInputValue("");
    } else {
      setValue(val);
    }
  };

  const handleTextInputChange = (event) => {
    setTextInputValue(event.target.value);
    setValue(event.target.value);
  };

  let options = [
    <MenuItem key={uuidv4()} onClick={() => handleChange("other")}>
      Enter your own
    </MenuItem>,
  ];

  labelArray.forEach((label) =>
    options.push(
      <MenuItem key={uuidv4()} onClick={() => handleChange(label)}>
        {label}
      </MenuItem>
    )
  );

  return (
    <>
      <Menu>
        {selectedValue !== "other" && (
          <MenuButton as={Button} colorScheme="green" w="full">
            {selectedValue || label}
          </MenuButton>
        )}
        <MenuList onChange={handleChange}>{options}</MenuList>
      </Menu>

      {selectedValue === "other" && (
        <VStack spacing={2} w="full">
          <Input
            placeholder="Enter your own value"
            value={textInputValue}
            onChange={handleTextInputChange}
            textAlign={"center"}
          />
        </VStack>
      )}
    </>
  );
};
