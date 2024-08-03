"use client";

import {
  Slide,
  SLIDE_WIDTH,
  SlideData,
  SLIDE_HEIGHT,
  SLIDE_PADDING,
  SlideNode,
} from "@/components/Slide";
import slides from "@/helpers/slides";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Background,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type NodeMouseHandler,
} from "@xyflow/react";
import { useChat } from "ai/react";
import "reactflow/dist/style.css";
import { callData } from "@/helpers/callData";
import { toast, Toaster } from "sonner";

const slidesToElements = async (result) => {
  console.log("slidesToElements", result);
  const start = Object.keys(result)[0];
  const stack = [{ id: start, position: { x: 0, y: 0 } }];
  const visited = new Set();
  const nodes = [];
  const edges = [];

  while (stack.length) {
    console.log("stack", stack);

    const { id, position } = stack.pop();
    const slide = result[id];
    console.log("slide", slide);
    const node = {
      id,
      type: "slide",
      position,
      data: slide,
      draggable: false,
    } satisfies Node<SlideData>;

    if (slide.left && !visited.has(slide.left)) {
      const nextPosition = {
        x: position.x - (SLIDE_WIDTH + SLIDE_PADDING),
        y: position.y,
      };

      stack.push({ id: slide.left, position: nextPosition });
      edges.push({
        id: `${id}->${slide.left}`,
        source: id,
        target: slide.left,
      });
    }

    if (slide.up && !visited.has(slide.up)) {
      const nextPosition = {
        x: position.x,
        y: position.y - (SLIDE_HEIGHT + SLIDE_PADDING),
      };

      stack.push({ id: slide.up, position: nextPosition });
      edges.push({ id: `${id}->${slide.up}`, source: id, target: slide.up });
    }

    if (slide.down && !visited.has(slide.down)) {
      const nextPosition = {
        x: position.x,
        y: position.y + (SLIDE_HEIGHT + SLIDE_PADDING),
      };

      stack.push({ id: slide.down, position: nextPosition });
      edges.push({
        id: `${id}->${slide.down}`,
        source: id,
        target: slide.down,
      });
    }

    if (slide.right && !visited.has(slide.right)) {
      const nextPosition = {
        x: position.x + (SLIDE_WIDTH + SLIDE_PADDING),
        y: position.y,
      };

      stack.push({ id: slide.right, position: nextPosition });
      edges.push({
        id: `${id}->${slide.down}`,
        source: id,
        target: slide.down,
      });
    }

    nodes.push(node);
    visited.add(id);
  }

  return { start, nodes, edges };
};

const nodeTypes = {
  slide: Slide,
};

const initialSlide = "0";

const Flow = (props) => {
  const { fitView } = useReactFlow();
  // const { start, nodes, edges } = useMemo(
  //   async () => await slidesToElements(),
  //   []
  // );
  const [data, setData] = useState({ start: null, nodes: [], edges: [] });

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const result = await slidesToElements();
  //     setData(result);
  //   };

  //   fetchData();
  // }, []);

  const { start, nodes, edges } = data;

  const handleNodeClick = useCallback<NodeMouseHandler>(
    (_, node) => {
      fitView({ nodes: [{ id: node.id }], duration: 150 });
    },
    [fitView]
  );
  const [inputValue, setinputValue] = useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();
    toast("We are loading your presentation slide!");
    const result = await callData(inputValue);
    const data = await slidesToElements(result.data);
    toast.success(`Tu slide fue creado!`); // Muestra el mensaje de éxito
    setData(data);
  };
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Toaster position="top-center" />

      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        edges={edges}
        fitView
        fitViewOptions={{ nodes: [{ id: start }] }}
        minZoom={0.1}
        onNodeClick={handleNodeClick}
      >
        <Panel
          className="bg-white rounded-lg w-full max-w-sm  p-4 "
          position="top-left"
        >
          <form className="relative" onSubmit={handleSubmit}>
            <label className="mb-2 text-sm font-medium ">
              Acerca de que quiere tu slide?
            </label>
            <div className="relative mt-2">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                placeholder="What is the temperature in the living room?"
                value={inputValue}
                onChange={(e) => setinputValue(e.target.value)}
              />
            </div>
          </form>
        </Panel>
        <Background color="#f2f2f2" variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};
export default function Chat(props) {
  return (
    <ReactFlowProvider>
      <Flow {...props} />
    </ReactFlowProvider>
  );
}
