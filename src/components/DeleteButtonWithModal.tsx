import { SmallCloseIcon } from "@chakra-ui/icons";
import { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

interface Props {
  onDelete?: (index: number) => void;
  index?: number;
  modalTitle?: string;
  modalBody?: string;
}

export const DeleteButtonWithModal: React.FC<Props> = ({
  onDelete = () => {},
  index = 0,
  modalTitle = "Delete Item",
  modalBody = "Are you sure you want to delete this item?",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const onDeleteConfirmed = () => {
    onDelete(index);
    setIsOpen(false);
  };

  return (
    <>
      <SmallCloseIcon
        color="red.500"
        boxSize="5"
        onClick={() => setIsOpen(true)}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{modalBody}</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Cancel</Button>
            <Button colorScheme="red" ml={3} onClick={onDeleteConfirmed}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
