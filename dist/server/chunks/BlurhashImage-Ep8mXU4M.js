import { jsxs, jsx } from "react/jsx-runtime";
import { memo, useState, useRef, useEffect, useCallback } from "react";
import { decode } from "blurhash";
const blurhashCache = /* @__PURE__ */ new Map();
function decodeBlurhashToDataUrl(hash) {
  if (blurhashCache.has(hash)) return blurhashCache.get(hash);
  try {
    const width = 32;
    const height = 32;
    const pixels = decode(hash, width, height);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const imageData = ctx.createImageData(width, height);
    imageData.data.set(pixels);
    ctx.putImageData(imageData, 0, 0);
    const dataUrl = canvas.toDataURL();
    blurhashCache.set(hash, dataUrl);
    return dataUrl;
  } catch {
    return null;
  }
}
const BlurhashImage = memo(function BlurhashImage2({
  src,
  alt,
  blurhash,
  className = "",
  priority = false,
  sizes
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);
  const blurhashDataUrl = blurhash ? decodeBlurhashToDataUrl(blurhash) : null;
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [src]);
  const handleLoad = useCallback(() => setIsLoaded(true), []);
  return /* @__PURE__ */ jsxs("div", { className: `relative overflow-hidden ${className}`, children: [
    blurhashDataUrl && !isLoaded && /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-0 w-full h-full bg-cover bg-center",
        style: { backgroundImage: `url(${blurhashDataUrl})` },
        "aria-hidden": "true"
      }
    ),
    /* @__PURE__ */ jsx(
      "img",
      {
        ref: imgRef,
        src,
        alt,
        loading: priority ? "eager" : "lazy",
        decoding: "async",
        fetchPriority: priority ? "high" : "auto",
        sizes,
        className: `w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`,
        onLoad: handleLoad
      }
    )
  ] });
});
export {
  BlurhashImage as B
};
