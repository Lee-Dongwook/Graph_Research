import React, { useEffect } from "react";
import { Flex } from "@chakra-ui/react";
import { Header } from "./components/Header";
import { NetworkGraph } from "./components/MyGraph";
import { useSelector } from "react-redux";
import { StateApp } from "./state/reducers";
import { getAllElements, handleGraphClick } from "./state/actions";
import { useAppDispatch } from "./hooks";
import { ActionContainer } from "./components/ActionContainer";

function App() {
  const dispatch = useAppDispatch();

  const { dataGraph, selectedElements } = useSelector(
    (state: StateApp) => state
  );

  useEffect(() => {
    async function loadInitialData() {
      dispatch(getAllElements());
    }
    loadInitialData();
  }, []);

  return (
    <Flex direction={"column"}>
      <Header />
      <Flex bg="gray.200">
        <NetworkGraph
          data={dataGraph}
          selectedElements={selectedElements}
          onNodeClick={(event) => dispatch(handleGraphClick(event))}
        />
        <ActionContainer />
      </Flex>
    </Flex>
  );
}

export default App;
