import { useCallback, useRef, useState } from "react";

export type UseSessionRecorderResult = {
  startRecording: (streams: MediaStream[]) => void;
  stopRecording: () => void;
  recording: boolean;
  blob: Blob | null;
};

export function useSessionRecorder(): UseSessionRecorderResult {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [recording, setRecording] = useState(false);

  const startRecording = useCallback((streams: MediaStream[]) => {
    if (recorderRef.current || streams.length === 0) return;
    const combined = new MediaStream();

    streams.forEach((s) => {
      s.getTracks().forEach((t) => combined.addTrack(t));
    });

    if (combined.getTracks().length === 0) return;
    const rec = new MediaRecorder(combined);
    rec.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };
    rec.onstop = () => {
      setBlob(new Blob(chunksRef.current, { type: rec.mimeType }));
      chunksRef.current = [];
      recorderRef.current = null;
    };
    rec.start();
    recorderRef.current = rec;
    setRecording(true);
  }, []);

  const stopRecording = useCallback(() => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      setRecording(false);
    }
  }, []);

  return { startRecording, stopRecording, recording, blob };
}
