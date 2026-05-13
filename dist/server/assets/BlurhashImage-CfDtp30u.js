import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect, useCallback } from "react";
import { decode } from "blurhash";
function BlurhashImage({ src, alt, blurhash, className = "" }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoaded(true);
    }
  }, [src]);
  useEffect(() => {
    if (!blurhash || !canvasRef.current) return;
    try {
      const width = 32;
      const height = 32;
      const pixels = decode(blurhash, width, height);
      const canvas = canvasRef.current;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const imageData = ctx.createImageData(width, height);
      imageData.data.set(pixels);
      ctx.putImageData(imageData, 0, 0);
    } catch {
    }
  }, [blurhash]);
  const handleLoad = useCallback(() => setIsLoaded(true), []);
  return /* @__PURE__ */ jsxs("div", { className: `relative overflow-hidden ${className}`, children: [
    blurhash && /* @__PURE__ */ jsx(
      "canvas",
      {
        ref: canvasRef,
        className: `absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"}`,
        "aria-hidden": "true"
      }
    ),
    /* @__PURE__ */ jsx(
      "img",
      {
        ref: imgRef,
        src,
        alt,
        className: `w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`,
        onLoad: handleLoad
      }
    )
  ] });
}
export {
  BlurhashImage as B
};
