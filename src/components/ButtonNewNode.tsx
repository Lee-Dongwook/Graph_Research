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

interface Props {
  nodes: Node[];
  onSubmit?: (nodeNames: string[], label) => void;
  buttonLabel?: string;
  modalTitle?: string;
}

export const ButtonNewNode: React.FC<Props> = ({
  nodes,
  onSubmit = () => {},
  buttonLabel = "New node",
  modalTitle = "Create new node(s)",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => setIsOpen(false);

  const onCreateNodes = (nodeNames: string[], label: string) => {
    console.log("handleNodeCreate", nodeNames, label);

    onSubmit(nodeNames, label);
    setIsOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        colorScheme="green"
        // bg="gray.500"
        textColor="white"
        fontWeight="bold"
        w="full"
      >
        {buttonLabel}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormNewNode
              nodes={nodes}
              onSubmit={(nodeNames, label) => onCreateNodes(nodeNames, label)}
              onClose={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

interface PropsFormNewNode {
  nodes: Node[];
  onSubmit: (nodeNames: string[], label: string) => void;
  onClose: () => void;
}

export const FormNewNode: React.FC<PropsFormNewNode> = ({
  nodes,
  onSubmit,
  onClose,
}) => {
  const [nodeNames, setNodesNames] = useState<string[]>([]);
  const [label, setLabel] = useState("");

  const allLabels = nodes.map((node) => node.labels[0]);
  const uniqueLabels = new Set(allLabels);
  const labels = sortList(Array.from(uniqueLabels));

  const onAddNode = (name) => {
    setNodesNames([...nodeNames, name]);
  };

  const onNodeDelete = (index) => {
    setNodesNames(nodeNames.filter((_, i) => i !== index));
  };

  const onSetLabel = (label: string) => {
    setLabel(label);
  };

  return (
    <>
      {/* Node name form, and list of selected nodes  */}
      <FormSingleNode onSubmit={onAddNode} />

      {nodeNames.map((name, index) => {
        return (
          <Flex
            alignItems={"center"}
            key={index}
            justifyContent="space-between"
            p={"1em 1em 0 1em"}
          >
            <Text pl={"1.5em"}>{name}</Text>
            <SmallCloseIcon onClick={() => onNodeDelete(index)} />
          </Flex>
        );
      })}

      {/* Node label  */}
      <Flex direction={"column"} pt={5} pl={1}>
        <FormLabel>Label (Person, Book, etc.):</FormLabel>
        <DropdownWithFreeText
          label="Label"
          labelArray={labels}
          setValue={(s) => onSetLabel(s)}
        />
      </Flex>

      <ModalFooter>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => onSubmit(nodeNames, label)}
          colorScheme="green"
          // there's a bug, we need both props below: https://github.com/chakra-ui/chakra-ui/issues/7269
          disabled={!(nodeNames.length > 0 && label)}
          isDisabled={!(nodeNames.length > 0 && label)}
          ml={3}
        >
          Create
        </Button>
      </ModalFooter>
    </>
  );
};

interface PropsFormSingleNode {
  onSubmit: (name: string) => void;
}

export const FormSingleNode: React.FC<PropsFormSingleNode> = ({ onSubmit }) => {
  const [name, setName] = useState("");

  const handleSubmit = (name: string) => {
    console.log("handleSubmit", name);

    if (name === "") return;

    onSubmit(name);
    setName("");
  };

  return (
    <>
      <FormLabel>Name:</FormLabel>
      <FormCustom
        label="Name"
        value={name}
        setValue={setName}
        onSubmit={() => handleSubmit(name)}
      />
    </>
  );
};
