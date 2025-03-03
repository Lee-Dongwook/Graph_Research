import { Driver, Node } from "neo4j-driver";
import { enumUserAction, EventGraphClick, GraphElement } from "../interfaces";
import {
  createNewNodes,
  createRelationship,
  createRelationships,
  deleteNode,
  deleteNodes,
  queryAllElements,
  queryNodeList,
} from "../utils/dbFunctions";
import { convertNeoToVis } from "../utils/graphLib";
import { extractEdgeFromGraph, extractNodeFromGraph } from "./helpers";
import { StateApp } from "./reducers";

interface ElementFromClick {
  elementType: "node" | "relationship";
  element: GraphElement;
  elementExists: boolean;
}

export const addNode = (nodeNames: string[], label: string) => {
  return async (dispatch, getState) => {
    const driver = getState().driver;

    const res = await createNewNodes(driver, nodeNames, label);
    const nodeList: Node[] = res?.records.map((r) => r.get("nodes"))[0] || [];

    dispatch({ type: "SET_NODE_LIST", payload: nodeList });
    dispatch(getAllElements());
  };
};

export const getNodeList = (driver: Driver) => {
  return async (dispatch) => {
    const nodeList = await queryNodeList(driver);

    dispatch({ type: "SET_NODE_LIST", payload: nodeList });
  };
};

export const getAllElements = () => {
  return async (dispatch, getState) => {
    const { driver, selectedElements } = getState() as StateApp;

    const { nodeList, relationshipList } = await queryAllElements(driver);
    const dataGraph = convertNeoToVis(
      nodeList,
      relationshipList,
      selectedElements
    );

    dispatch({ type: "SET_NODE_LIST", payload: nodeList });
    dispatch({ type: "SET_RELATIONSHIP_LIST", payload: relationshipList });
    dispatch({ type: "SET_DATA_GRAPH", payload: dataGraph });
  };
};

export const handleGraphClick = (event: EventGraphClick) => {
  console.log("handleGraphClick", event);

  return async (dispatch, getState) => {
    const isRelevantClick = event.nodes.length > 0 || event.edges.length > 0;
    if (!isRelevantClick) return () => {};

    const state = getState() as StateApp;

    const { elementType, element, elementExists } = getElementFromClick(
      event,
      state
    );

    if (elementExists) return () => {};

    const isValidAction =
      (state.currentAction === enumUserAction.deleteNodes &&
        elementType === "node") ||
      (state.currentAction === enumUserAction.deleteRelationships &&
        elementType === "relationship") ||
      (state.currentAction === enumUserAction.createRelationships &&
        elementType === "node");

    if (!isValidAction) return () => {};

    const newSelectedElements = [...state.selectedElements, element];
    const dataGraph = convertNeoToVis(
      state.nodeList,
      state.relationshipList,
      newSelectedElements
    );

    dispatch({ type: "SET_SELECTED_ELEMENTS", payload: newSelectedElements });
    dispatch({ type: "SET_DATA_GRAPH", payload: dataGraph });
  };
};

export const getElementFromClick = (
  event: EventGraphClick,
  state: StateApp
): ElementFromClick => {
  const elementType = event.nodes.length > 0 ? "node" : "relationship";

  const element =
    elementType === "node"
      ? extractNodeFromGraph(event, state.nodeList)
      : extractEdgeFromGraph(
          event,
          state.dataGraph,
          state.relationshipList,
          state.nodeList
        );

  const elementExists = state.selectedElements.some(
    (s) => s?.elementId === element?.elementId
  );

  return { elementType, element, elementExists };
};

export const handleRemoveFromSelection = (element: GraphElement) => {
  return async (dispatch, getState) => {
    const { selectedElements } = getState() as StateApp;

    const newSelectedElements = selectedElements.filter(
      (el) => el.elementId !== element.elementId
    );

    dispatch({ type: "SET_SELECTED_ELEMENTS", payload: newSelectedElements });
    dispatch(getAllElements());
  };
};

export const handleCreateRelationship = () => {
  return async (dispatch, getState) => {
    const { driver, selectedElements, newRelationshipLabel } =
      getState() as StateApp;

    const nodes = selectedElements.map((el) => el.element as Node);

    await createRelationships(driver, newRelationshipLabel, nodes);
    dispatch({ type: "SET_SELECTED_ELEMENTS", payload: [] });
    dispatch({ type: "SET_NEW_RELATIONSHIP_LABEL", payload: "" });
  };
};

export const handleSetActionType = (actionType: enumUserAction) => {
  console.log("handleSetActionType", actionType);

  return async (dispatch, getState) => {
    const { currentAction } = getState() as StateApp;

    const isFirstAction = currentAction === enumUserAction.none;
    console.log("isFirstAction", isFirstAction);

    if (isFirstAction) {
      dispatch({ type: "SET_CURRENT_ACTION", payload: actionType });
      return;
    }

    if (actionType === enumUserAction.none) {
      dispatch({ type: "SET_SELECTED_ELEMENTS", payload: [] });
    }

    switch (currentAction) {
      case enumUserAction.deleteNodes:
        dispatch(handleDeleteNodes());
        break;
      case enumUserAction.createRelationships:
        dispatch(handleCreateRelationship());
        break;
      case enumUserAction.deleteRelationships:
        dispatch(handleDeleteRelationships());
        break;
      default:
        break;
    }

    dispatch({ type: "SET_CURRENT_ACTION", payload: enumUserAction.none });
    dispatch({ type: "SET_SELECTED_ELEMENTS", payload: [] });
    dispatch(getAllElements());
  };
};

export const handleDeleteNodes = () => {
  return async (dispatch, getState) => {
    const { driver, selectedElements, nodeList } = getState() as StateApp;

    const nodesToDelete = selectedElements.map((e) =>
      nodeList.find((n) => n.elementId === e.elementId)
    ) as unknown as Node[];

    await deleteNodes(driver, nodesToDelete);
    dispatch({ type: "SET_SELECTED_ELEMENTS", payload: [] });
    dispatch(getAllElements());
  };
};

export const handleDeleteRelationships = () => {
  return async (dispatch, getState) => {
    dispatch({ type: "SET_SELECTED_ELEMENTS", payload: [] });
  };
};

export const handleSetNewRelationshipLabel = (label: string) => ({
  type: "SET_NEW_RELATIONSHIP_LABEL",
  payload: label,
});
