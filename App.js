import { useState, useEffect } from "react";

export default function App() {
  return <ResizablePanes direction='horizontal' />;
}

function ResizablePanes({ direction }) {
  const isVertical = direction === "vertical";

  return (
    <div
      className={`w-screen h-screen flex ${
        isVertical ? "flex-col" : "flex-row"
      }`}
    >
      <ResizablePane
        minSize={150}
        initialSize={200}
        maxSize={300}
        isVertical={isVertical}
        bgColor={"bg-red-400"}
      />
      <ResizablePane
        minSize={150}
        initialSize={300}
        grow='true'
        isVertical={isVertical}
        bgColor={"bg-yellow-400"}
      />
      <ResizablePane
        minSize={150}
        initialSize={150}
        maxSize={300}
        isVertical={isVertical}
        bgColor={"bg-emerald-400"}
      />
    </div>
  );
}

function ResizablePane({
  minSize,
  initialSize,
  maxSize,
  grow,
  isVertical,
  bgColor,
}) {
  const [size, setSize] = useState(initialSize);
  const [isResizing, setIsResizing] = useState(false);

  const dimension = isVertical ? "height" : "width";

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;

      const movement = isVertical ? e.movementY : e.movementX;
      let newSize = size + movement;

      newSize = Math.max(minSize, Math.min(maxSize, newSize));
      setSize(newSize);
    };

    const handleMouseUp = () => setIsResizing(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [size, isResizing, minSize, maxSize, isVertical]);

  const handleMouseDown = () => setIsResizing(true);

  return (
    <div
      className={`relative ${bgColor} ${grow ? "grow" : ""} shrink-0`}
      style={{ [dimension]: `${size}px` }}
    >
      {!grow && (
        <ResizableHandle
          isResizing={isResizing}
          isVertical={isVertical}
          handleMouseDown={handleMouseDown}
        />
      )}
    </div>
  );
}

function ResizableHandle({ isResizing, isVertical, handleMouseDown }) {
  const positionHandleStyle = isVertical
    ? "h-1 left-0 right-0 bottom-0 cursor-row-resize"
    : "w-1 top-0 bottom-0 right-0 cursor-col-resize";

  return (
    <div
      className={`absolute ${positionHandleStyle} hover:bg-blue-600 ${
        isResizing ? "bg-blue-600" : ""
      }`}
      onMouseDown={handleMouseDown}
    />
  );
}
