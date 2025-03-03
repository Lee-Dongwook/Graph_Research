import { Node, Relationship } from "neo4j-driver";
import {
  enumUserAction,
  EventGraphClick,
  GraphData,
  GraphElement,
} from "../interfaces";
import {
  nodeToString,
  getRelationshionLabel,
  sortList,
} from "../utils/graphLib";

export const selectActionTitle = (
  actionType: enumUserAction,
  selectedElements: GraphElement[]
): string => {
  switch (actionType) {
    case enumUserAction.none:
      return "";
    case enumUserAction.deleteNodes:
      return "Select nodes to delete";
    case enumUserAction.createRelationships:
      if (selectedElements.length === 0) {
        return "Select the starting node";
      } else {
        return "Select nodes to apply";
      }

    case enumUserAction.deleteRelationships:
      return "Select relationships to delete";
    default:
      return "";
  }
};

export const extractNodeFromGraph = (
  event: EventGraphClick,
  nodeList: Node[]
): GraphElement => {
  const nodeId = event.nodes[0];
  const node = nodeList.filter((n) => n.elementId === nodeId)[0];
  const label = nodeToString(node);

  return {
    elementType: "node",
    element: node,
    label: label,
    elementId: node.elementId,
  };
};

export const extractEdgeFromGraph = (
  event: EventGraphClick,
  dataGraph: GraphData,
  relationshipList: Relationship[],
  nodeList: Node[]
): GraphElement => {
  const edgeId = event.edges[0];
  const edge = dataGraph.edges.filter((n) => n?.id === edgeId)[0];

  const relationship = relationshipList.filter(
    (r) =>
      r.startNodeElementId === edge.from &&
      r.endNodeElementId === edge.to &&
      r.type === edge.label
  )[0];

  const label = getRelationshionLabel(relationship, nodeList);

  return {
    elementType: "relationship",
    element: relationship,
    label: label.label,
    elementId: relationship.elementId,
  };
};

export const cleanLabel = (s: string) => s.replace(/_/g, " ");

export const existingRelationshipLabels = (
  relationshipList: Relationship[]
) => {
  const allLabels = relationshipList.map((r) => r.type);
  const allLabelsClean = allLabels.map((l) => cleanLabel(l));
  const uniqueLabels = new Set(allLabelsClean);
  const labels = sortList(Array.from(uniqueLabels));

  return labels;
};

export const existingNodeTypes = (nodes: Node[]) => {
  const allLabels = nodes.map((n) => n.labels[0]);
  const uniqueLabels = new Set(allLabels);
  const labels = sortList(Array.from(uniqueLabels));

  return labels;
};
