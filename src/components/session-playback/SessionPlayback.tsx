import { useEffect, useState } from "react";
import "./session-playback.scss";

export default function SessionPlayback({ blob }: { blob: Blob }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!blob) return;
    const objectUrl = URL.createObjectURL(blob);
    setUrl(objectUrl);
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [blob]);

  if (!url) {
    return null;
  }

  return <video className="session-playback" src={url} controls />;
}
