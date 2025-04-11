import React, { useRef, useState, useEffect } from "react";
import PrimaryButton from "./PrimaryButton";
import DangerButton from "./DangerButton";

const SignaturePad = ({ blurb, signatureCallback, onSave, value }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [width, setWidth] = useState(300);
  const [signatureData, setSignatureData] = useState(value || null);

  useEffect(() => {
    const updateWidth = () => {
      if (canvasRef.current) {
        setWidth(canvasRef.current.parentElement.clientWidth - 10);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    
    if (value !== null) {
      loadSignature(value);
    }
  }, [width, value]);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    setIsEmpty(false);
  };

  const loadSignature = (signature) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = signature;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setIsEmpty(false);
    };
    setSignatureData(signature);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    saveSignature()
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
  };

  const saveSignature = () => {
    if(!isEmpty) {
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL("image/png");
      setSignatureData(dataUrl);
      signatureCallback(signatureData);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-full mx-3 border border-gray-400 rounded-lg border-1">
        <canvas
          ref={canvasRef}
          width={width}
          height={150}
          className="m-2 bg-white"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center text-lg text-gray-400 pointer-events-none">
            Sign Here
          </div>
        )}
      </div>
      <div className="flex inline-flex justify-between w-full mt-2">
        <div>
            <PrimaryButton
                className="px-4 py-2 mt-2"
                onClick={(e) => onSave(signatureData)}
            >Save</PrimaryButton>
        </div>
        {blurb && typeof blurb !== 'undefined' && (
            <div className="w-full my-2 text-center">
                <span className="text-xs text-gray-400 font-italic">{blurb}</span>
            </div>
        )}
        <div>
            <DangerButton
              onClick={clearSignature}
              className="px-4 py-2 mt-2"
            >
              Clear
            </DangerButton>
        </div>
      </div>
    </div>
  );
};

export default SignaturePad;
