import neo4j from "neo4j-driver";
import { Driver, Node, Relationship } from "neo4j-driver-core";
import { env } from "../env";

export const instantiateNeoDriver = () => {
  return neo4j.driver(
    env.REACT_APP_NEO_CONN_STRING,
    neo4j.auth.basic("neo4j", env.REACT_APP_NEO_PASSWORD)
  );
};

export const queryNodeList = async (driver: Driver) => {
  const query = "MATCH (n) RETURN n";
  const result = await dbQuery(driver, query);
  const data: Node[] = result?.records.map((r) => r.get("n")) || [];
  return data;
};

export const queryRelationshipList = async (driver: Driver) => {
  const query = "MATCH ()-[r]->() RETURN r";
  const result = await dbQuery(driver, query);
  const data: Relationship[] = result?.records.map((r) => r.get("r")) || [];
  return data;
};

const dbQuery = async (driver: Driver, query) => {
  const session = driver.session();

  try {
    const res = await session.run(query);
    console.log("db query result: ", { query, res });
    return res;
  } catch (error) {
    console.error("Error executing query", { query, error });
  } finally {
    session.close();
  }
};

export const createNode = async (driver: Driver, nodeName, nodeLabel) => {
  console.log("createNode", nodeName, nodeLabel);

  const query = `CREATE (n:${nodeLabel} {name: '${nodeName}'}) RETURN n`;
  dbQuery(driver, query);
};

const querySelectAll = " WITH * MATCH (n) RETURN collect(n) AS nodes";

export const createNewNodes = async (
  driver: Driver,
  nodeNames: string[],
  label: string
) => {
  console.log("createNewNodes", nodeNames, label);

  const nodes = nodeNames.map((name) => `(:${label} {name: '${name}'})`);
  const query = `CREATE ${nodes.join(", ")} ${querySelectAll}`;

  return await dbQuery(driver, query);
};

export const createRelationship = async (
  driver: Driver,
  from: Node,
  to: Node,
  relationship: string
) => {
  const vars = {
    labelFrom: from.labels[0],
    nameFrom: from.properties?.name,
    labelTo: to.labels[0],
    nameTo: to.properties?.name,
    relType: relationship,
  };

  const query = `MATCH (p:${vars.labelFrom} {name: '${vars.nameFrom}'}), (m:${vars.labelTo} {name: '${vars.nameTo}'}) CREATE (p)-[:${vars.relType}]->(m)`;
  dbQuery(driver, query);
};

function generateRandomString(length: number) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export const createRelationships = async (
  driver: Driver,
  relationshipType: string,
  nodes: Node[]
) => {
  const uuids = nodes.map((_) => generateRandomString(16));
  const [firstNode, ...otherNodes] = nodes;

  const cleanRelationshipType = relationshipType.replace(/ /g, "_");

  const matchClauses = otherNodes.map(
    (node, index) =>
      `MATCH (${uuids[index + 1]}:${node.labels[0]} {name: '${
        node.properties.name
      }'})`
  );
  const createClauses = otherNodes.map(
    (_, index) =>
      `CREATE (${uuids[0]})-[:${cleanRelationshipType}]->(${uuids[index + 1]})`
  );

  const query = `
    MATCH (${uuids[0]}:${firstNode.labels[0]} {name: '${
      firstNode.properties.name
    }'})
    ${matchClauses.join("\n")}
    ${createClauses.join("\n")}
  `;

  console.log({ query, uuids });
  return await dbQuery(driver, query);
};

export const deleteNode = async (driver: Driver, node: Node) => {
  console.log("deleteNode", node);

  const query = `Match (p:${node.labels[0]} {name: '${node.properties.name}'}) Detach Delete p`;
  dbQuery(driver, query);
};

export const deleteNodes = async (driver: Driver, nodes: Node[]) => {
  console.log("deleteNodes", nodes);
  const nodeIdList = nodes.map((n) => n.elementId);

  const query = `MATCH (n) WHERE elementId(n) IN [${nodes
    .map((n) => `"${n.elementId}"`)
    .join(", ")}] DETACH DELETE n`;
  dbQuery(driver, query);
};

export const deleteRelationship = async (
  driver: Driver,
  relationship: Relationship,
  nodeFrom: Node,
  nodeTo: Node
) => {
  console.log("deleteRelationship", relationship, nodeFrom, nodeTo);

  const query = `
    MATCH (p {name: '${nodeFrom.properties?.name}'})-[r:${relationship.type}]->(s {name: '${nodeTo.properties?.name}'})
    DELETE r`;
  dbQuery(driver, query);
};

export const queryAllElements = async (driver: Driver) => {
  const nodeList = await queryNodeList(driver);
  const relationshipList = await queryRelationshipList(driver);

  return { nodeList, relationshipList };
};
