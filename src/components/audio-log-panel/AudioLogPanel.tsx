import "./audio-log-panel.scss";
import { useEffect, useState } from "react";
import { useLoggerStore } from "../../lib/store-logger";
import { pcm16ToWav } from "../../lib/utils";

/**
 * Simple panel that renders a list of audio events.
 * User sent audio is shown as a message from the user and
 * AI sent audio as a message from the AI.
 */
export default function AudioLogPanel() {
  const { logs } = useLoggerStore();
  const [messages, setMessages] = useState<
    {
      id: number;
      sender: "user" | "ai";
      url: string;
    }[]
  >([]);

  useEffect(() => {
    const filtered = logs
      .filter(
        (l) => l.type === "client.realtimeInput" || l.type === "server.audio",
      )
      .map((l, idx) => {
        const sender = l.type === "server.audio" ? "ai" : "user";
        let url = "";
        if (l.audio) {
          const blob = pcm16ToWav(l.audio);
          url = URL.createObjectURL(blob);
        }
        return { id: idx, sender, url };
      });
    // revoke old URLs
    messages.forEach((m) => URL.revokeObjectURL(m.url));
    setMessages(filtered);
  }, [logs]);

  return (
    <div className="audio-log-panel">
      <h2>Audio</h2>
      <ul>
        {messages.map((m) => (
          <li key={m.id} className={m.sender}>
            {m.url ? (
              <audio controls src={m.url} />
            ) : m.sender === "user" ? (
              "User sent audio"
            ) : (
              "AI sent audio"
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
