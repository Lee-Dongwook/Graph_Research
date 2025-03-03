import React, { useEffect, useRef } from "react";
import { Network } from "vis-network";
import { GraphData, GraphElement } from "../interfaces";

interface PropsNetworkGraph {
  data: GraphData;
  selectedElements: GraphElement[];
  onNodeClick?: (params) => void;
}

const MyGraph: React.FC<PropsNetworkGraph> = ({
  data,
  selectedElements,
  onNodeClick = () => {},
}) => {
  console.log("inside my graph", { data, selectedElements });
  const container = useRef(null);

  const { nodes, edges } = data;

  useEffect(() => {
    console.log("inside use effect", { data, selectedElements });

    let network;
    if (container.current) {
      // @ts-ignore
      network = new Network(container.current, { nodes, edges }, options);
    }

    network?.on("click", function (params) {
      onNodeClick(params);
    });
  }, [data, selectedElements]);

  return <div ref={container} style={{ height: "93vh", width: "100vw" }} />;
};

const options = {
  autoResize: true,
  nodes: {
    shape: "box",
    font: {
      size: 40,
    },
    borderWidth: 2,
  },
  edges: {
    width: 5,
    font: {
      size: 24,
    },
  },
  layout: {
    randomSeed: 1,
  },
  physics: {
    enabled: true,
    barnesHut: {
      gravitationalConstant: -8000,
      springLength: 500,
    },
  },
  interaction: {
    keyboard: {
      enabled: true,
      speed: { x: 10, y: 10, zoom: 0.02 },
      bindToWindow: true,
      autoFocus: true,
    },
  },
};

export const NetworkGraph = React.memo(MyGraph);
