import { Node, Relationship } from "neo4j-driver";

export interface PersonNode {
  name: string;
}

export interface LabelInfo {
  label: string;
  elementId: string;
}

export interface GraphElement extends LabelInfo {
  elementType: "node" | "relationship";
  element: Node | Relationship;
}

export interface NodeGraphData {
  id: string;
  label: string;
  title: string;
  group?: number;
  color?: string;
}

export interface EdgeGraphData {
  from: string;
  to: string;
  label: string;
  id?: string;
}

export interface GraphData {
  nodes: NodeGraphData[];
  edges: EdgeGraphData[];
}

export interface EventGraphClick {
  nodes: string[];
  edges: string[];
}

export enum enumUserAction {
  "none",
  "createRelationships",
  "deleteRelationships",
  "deleteNodes",
}
