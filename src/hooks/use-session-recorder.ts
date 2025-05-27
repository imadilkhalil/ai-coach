import { useCallback, useRef, useState } from "react";
import { audioContext } from "../lib/utils";

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

  const audioCtxRef = useRef<AudioContext | null>(null);

  const startRecording = useCallback((streams: MediaStream[]) => {
    if (recorderRef.current || streams.length === 0) return;

    (async () => {
      const combined = new MediaStream();
      const audioTracks: MediaStreamTrack[] = [];

      streams.forEach((s) => {
        s.getVideoTracks().forEach((t) => combined.addTrack(t));
        audioTracks.push(...s.getAudioTracks());
      });

      if (audioTracks.length === 1) {
        combined.addTrack(audioTracks[0]);
      } else if (audioTracks.length > 1) {
        const ctx = await audioContext({ id: "session-recorder" });
        audioCtxRef.current = ctx;
        if (ctx.state === "suspended") {
          await ctx.resume();
        }
        const destination = ctx.createMediaStreamDestination();
        audioTracks.forEach((t) => {
          const src = ctx.createMediaStreamSource(new MediaStream([t]));
          src.connect(destination);
        });
        const mixed = destination.stream.getAudioTracks()[0];
        if (mixed) combined.addTrack(mixed);
      }

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
        audioCtxRef.current?.close();
        audioCtxRef.current = null;
      };
      rec.start();
      recorderRef.current = rec;
      setRecording(true);
    })();
  }, []);

  const stopRecording = useCallback(() => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      setRecording(false);
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
  }, []);

  return { startRecording, stopRecording, recording, blob };
}
