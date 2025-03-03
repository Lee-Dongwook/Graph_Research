import { Button, Container, Select, Text } from "@chakra-ui/react";
import { Node, Relationship } from "neo4j-driver";
import { useState } from "react";
import { nodeToString, sortList } from "../utils/graphLib";
import { DropdownWithFreeText } from "./DropdownWithFreeText";
import { v4 as uuidv4 } from "uuid";

interface Props {
  nodes: Node[];
  relationshipList: Relationship[];
  onSubmit: (from, to, relationship) => void;
}

export const NewRelationshipForm: React.FC<Props> = ({
  nodes,
  relationshipList,
  onSubmit,
}) => {
  const [from, setFrom] = useState<Node>();
  const [to, setTo] = useState<Node>();
  const [relationship, setRelationship] = useState<string>("");

  const allLabels = relationshipList.map((r) => r.type);
  const uniqueLabels = new Set(allLabels);
  const labels = sortList(Array.from(uniqueLabels));

  const handleFromSubmit = (event) => {
    const elementId = event.target.value;
    const node = nodes.filter((n) => n.elementId === elementId)[0];
    console.log(elementId, node);

    setFrom(node);
  };

  const handleToSubmit = (event) => {
    const elementId = event.target.value;
    const node = nodes.filter((n) => n.elementId === elementId)[0];
    setTo(node);
  };

  return (
    <Container maxW="xl">
      <Text fontWeight={"bold"}>Create a new Relationship:</Text>
      <DropdownNodes
        label={from ? from?.properties?.name : "From"}
        nodes={nodes}
        value={from?.properties?.name}
        onChange={(e) => handleFromSubmit(e)}
      />
      <DropdownNodes
        label={to ? to?.properties?.name : "To"}
        nodes={nodes}
        value={to?.properties?.name}
        onChange={handleToSubmit}
      />
      <DropdownWithFreeText
        label="Relationship Type"
        labelArray={labels}
        setValue={(s) => setRelationship(s)}
      />
      {from && to && relationship ? (
        <Button onClick={() => onSubmit(from, to, relationship)}>
          Create!
        </Button>
      ) : null}
    </Container>
  );
};

const DropdownNodes = ({ label, nodes, value, onChange }) => {
  return (
    <Select
      maxW={"500px"}
      placeholder={label}
      value={value}
      onChange={onChange}
    >
      {nodes.map((node) => {
        const label = nodeToString(node);
        return <option key={uuidv4()}>{label}</option>;
      })}
    </Select>
  );
};
