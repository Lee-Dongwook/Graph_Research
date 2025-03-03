import { Driver, Node, Relationship } from "neo4j-driver";
import { enumUserAction, GraphData, GraphElement } from "../interfaces";
import { instantiateNeoDriver } from "../utils/dbFunctions";
import { convertNeoToVis } from "../utils/graphLib";

export interface StateApp {
  nodeList: Node[];
  relationshipList: Relationship[];
  dataGraph: GraphData;
  driver: Driver;
  selectedElements: GraphElement[];
  currentAction: enumUserAction;
  newRelationshipLabel: string;
}

const initialState: StateApp = {
  nodeList: [],
  relationshipList: [],
  dataGraph: convertNeoToVis([], [], []),
  driver: instantiateNeoDriver(),
  selectedElements: [],
  currentAction: enumUserAction.none,
  newRelationshipLabel: "",
};

export default function rootReducer(
  state: StateApp = initialState,
  action
): StateApp {
  switch (action.type) {
    case "SET_NODE_LIST":
      return { ...state, nodeList: action.payload };
    case "SET_RELATIONSHIP_LIST":
      return { ...state, relationshipList: action.payload };
    case "SET_DATA_GRAPH":
      return { ...state, dataGraph: action.payload };
    case "SET_SELECTED_ELEMENTS":
      return { ...state, selectedElements: action.payload };
    case "SET_CURRENT_ACTION":
      return { ...state, currentAction: action.payload };
    case "SET_NEW_RELATIONSHIP_LABEL":
      return { ...state, newRelationshipLabel: action.payload };
    default:
      return state;
  }
}

export type RootState = ReturnType<typeof rootReducer>;
