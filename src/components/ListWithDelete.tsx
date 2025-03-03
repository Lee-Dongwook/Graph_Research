import { Node } from "neo4j-driver";
import { Flex, Box, Text, List, ListItem, Container } from "@chakra-ui/react";
import { DeleteButtonWithModal } from "./DeleteButtonWithModal";
import { LabelInfo } from "../interfaces";
import { v4 as uuidv4 } from "uuid";

interface Props {
  title: string;
  listLabels: LabelInfo[];
  onDelete: (elementId: string) => void;
}

export const ListWithDelete: React.FC<Props> = ({
  title,
  listLabels,
  onDelete,
}) => {
  return (
    <Container>
      <Text borderBottom="1px solid black" fontWeight={"bold"}>
        {title}
      </Text>

      <Box ml="3">
        <List spacing={1} alignItems="center">
          {listLabels.map((label, index) =>
            LabelledListItem(label, index, onDelete)
          )}
        </List>
      </Box>
    </Container>
  );
};

const LabelledListItem = (label: LabelInfo, index, onDelete) => (
  <Flex key={uuidv4()} alignItems="center" justifyContent="center">
    <ListItem>{label.label}</ListItem>
    <Flex flexGrow={1} justifyContent="flex-end">
      <DeleteButtonWithModal
        onDelete={() => onDelete(label.elementId)}
        index={index}
        modalTitle="Delete Node"
        modalBody={`Are you sure you want to delete ${label.label}`}
      />
    </Flex>
  </Flex>
);
