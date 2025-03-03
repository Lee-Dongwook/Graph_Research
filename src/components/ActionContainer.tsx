import { Button, VStack } from "@chakra-ui/react";
import React from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { enumUserAction } from "../interfaces";
import { addNode, handleSetActionType } from "../state/actions";
import { StateApp } from "../state/reducers";
import { ButtonNewNode } from "./ButtonNewNode";
import { ButtonNewRelationship } from "./ButtonNewRelationship";
import { SelectionList } from "./SelectionList";

export const ActionContainer: React.FC<{}> = () => {
  const dispatch = useAppDispatch();

  const { nodeList, currentAction } = useAppSelector(
    (state: StateApp) => state
  );

  const showButtonNewNode = currentAction === enumUserAction.none;
  const showButtonCancel = currentAction !== enumUserAction.none;
  const showButtonCreateRel =
    currentAction === enumUserAction.none ||
    currentAction === enumUserAction.createRelationships;
  const showButtonDelNodes =
    currentAction === enumUserAction.none ||
    currentAction === enumUserAction.deleteNodes;
  const showbuttonDelRel =
    currentAction === enumUserAction.none ||
    currentAction === enumUserAction.deleteRelationships;

  return (
    <VStack
      spacing={1.5}
      minWidth={"200px"}
      position="absolute"
      top={"7vh"}
      right={1}
      direction="column"
      bg="gray.100"
      boxShadow="md"
      padding="0.5em"
      borderRadius={"md"}
    >
      {showButtonCancel && (
        <Button
          colorScheme="red"
          w="full"
          onClick={() => dispatch(handleSetActionType(enumUserAction.none))}
        >
          Cancel
        </Button>
      )}

      {showButtonCancel && <SelectionList />}

      {showButtonNewNode && (
        <ButtonNewNode
          nodes={nodeList}
          onSubmit={(names, label) => dispatch(addNode(names, label))}
        />
      )}

      {showButtonDelNodes && (
        <Button
          colorScheme="red"
          w="full"
          onClick={() =>
            dispatch(handleSetActionType(enumUserAction.deleteNodes))
          }
        >
          Delete nodes
        </Button>
      )}

      {showButtonCreateRel && <ButtonNewRelationship />}

      {showbuttonDelRel && (
        <Button
          colorScheme="red"
          w="full"
          onClick={() =>
            dispatch(handleSetActionType(enumUserAction.deleteRelationships))
          }
        >
          Delete Relationships
        </Button>
      )}
    </VStack>
  );
};
