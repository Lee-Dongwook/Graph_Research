import { Node, Relationship } from "neo4j-driver";
import color from "nice-color-palettes";
import { GraphElement } from "../interfaces";
import { cleanLabel } from "../state/helpers";

export const createColorPalate = (numColors: number = 12): string[] => {
  const allColors = color.flat();
  const colorPalate = allColors.slice(0, numColors);
  return colorPalate;
};

export const colors = createColorPalate(50);

export const selectNodeColor = (
  node: Node,
  selectedElements: GraphElement[],
  nodeTypes: string[]
) => {
  const isSelected = selectedElements.filter(
    (e) => e.elementId === node.elementId
  )[0];

  const indexNodeType = nodeTypes.indexOf(node.labels[0]) + 1;
  const indexNodeColor = isSelected ? 0 : indexNodeType;

  return colors[indexNodeColor];
};

export const selectEdgeColor = (
  relationship: Relationship,
  selectedElements: GraphElement[],
  relationshipTypes: string[]
) => {
  const isSelected = selectedElements.filter(
    (e) => e.elementId === relationship.elementId
  )[0];

  const indexNodeType =
    relationshipTypes.indexOf(cleanLabel(relationship.type)) + 1;
  const indexNodeColor = isSelected ? 0 : indexNodeType;

  return colors[indexNodeColor];
};
