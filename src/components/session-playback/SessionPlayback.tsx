import { useEffect, useRef } from "react";

export default function SessionPlayback({ blob }: { blob: Blob }) {
  const urlRef = useRef<string>("");

  useEffect(() => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [blob]);

  if (!blob) return null;

  return <video className="stream" src={urlRef.current} controls />;
}
