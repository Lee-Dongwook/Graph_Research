import React from "react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { Text, Flex, Container } from "@chakra-ui/react";
import { enumUserAction, GraphElement } from "../interfaces";
import { v4 as uuidv4 } from "uuid";
import { useAppDispatch, useAppSelector } from "../hooks";
import { handleRemoveFromSelection } from "../state/actions";
import { StateApp } from "../state/reducers";
import { selectActionTitle } from "../state/helpers";

export const SelectionList: React.FC = () => {
  const { currentAction, selectedElements } = useAppSelector(
    (state: StateApp) => state
  );

  const title = selectActionTitle(currentAction, selectedElements);

  return (
    <Flex alignItems={"center"} direction="column" pt={3}>
      <SelectionTitle title={title} />
      <SelectionBody
        selectedElements={selectedElements}
        currentAction={currentAction}
      />
    </Flex>
  );
};

const SelectionTitle = ({ title }) => (
  <Container>
    <Text textAlign={"center"}>{title}</Text>
  </Container>
);

const SelectionBody = ({ selectedElements, currentAction }) => {
  if (
    currentAction === enumUserAction.deleteNodes ||
    currentAction === enumUserAction.deleteRelationships
  ) {
    return (
      <Container>
        {selectedElements.map((el) => (
          <SelectionListItem el={el} key={uuidv4()} />
        ))}
      </Container>
    );
  }

  return (
    <Container>
      {selectedElements.length > 0 && (
        <>
          <Text>From</Text>
          <SelectionListItem el={selectedElements[0]} />
        </>
      )}

      <Text>To:</Text>
      {selectedElements.length > 1 &&
        selectedElements
          ?.slice(1)
          ?.map((el) => <SelectionListItem el={el} key={uuidv4()} />)}
    </Container>
  );
};

export const SelectionListItem: React.FC<{ el: GraphElement }> = ({ el }) => {
  const dispatch = useAppDispatch();

  return (
    <Flex w={"100%"} alignItems={"center"} justifyContent="space-between">
      <Text fontSize={"sm"} p="1">
        {el.label}
      </Text>
      <SmallCloseIcon onClick={() => dispatch(handleRemoveFromSelection(el))} />
    </Flex>
  );
};
