import { useState } from "react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Flex,
  FormLabel,
} from "@chakra-ui/react";
import { FormCustom } from "./FormCustom";
import { DropdownWithFreeText } from "./DropdownWithFreeText";
import { Node } from "neo4j-driver";
import { sortList } from "../utils/graphLib";
import { useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  handleSetActionType,
  handleSetNewRelationshipLabel,
} from "../state/actions";
import { StateApp } from "../state/reducers";
import { existingRelationshipLabels } from "../state/helpers";
import { enumUserAction } from "../interfaces";

export const ButtonNewRelationship: React.FC = () => {
  const dispatch = useAppDispatch();

  const { relationshipList, newRelationshipLabel } = useAppSelector(
    (state: StateApp) => state
  );

  const labels = existingRelationshipLabels(relationshipList);

  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => setIsOpen(false);

  const handleButtonClick = () => {
    dispatch(handleSetActionType(enumUserAction.createRelationships));

    if (newRelationshipLabel === "") {
      setIsOpen(true);
    }
  };

  const handleFormSubmit = (s: string) => {
    console.log("inside form submit");
    dispatch(handleSetNewRelationshipLabel(s));
  };

  return (
    <>
      <Button
        onClick={handleButtonClick}
        colorScheme="green"
        textColor="white"
        fontWeight="bold"
        w="full"
      >
        Create Relationship
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select a relationship label</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <DropdownWithFreeText
              label="Relationship Type"
              labelArray={labels}
              setValue={handleFormSubmit}
            />
          </ModalBody>
          <ModalFooter justifyContent="flex-end">
            <Button onClick={onClose} width={"10em"}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
