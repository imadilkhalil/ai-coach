import "./audio-log-panel.scss";
import { useEffect, useState } from "react";
import { useLoggerStore } from "../../lib/store-logger";

/**
 * Simple panel that renders a list of audio events.
 * User sent audio is shown as a message from the user and
 * AI sent audio as a message from the AI.
 */
export default function AudioLogPanel() {
  const { logs } = useLoggerStore();
  const [messages, setMessages] = useState<{ id: number; sender: "user" | "ai" }[]>([]);

  useEffect(() => {
    const filtered = logs
      .filter((l) => l.type === "client.realtimeInput" || l.type === "server.audio")
      .map((l, idx) => ({ id: idx, sender: l.type === "server.audio" ? "ai" : "user" }));
    setMessages(filtered);
  }, [logs]);

  return (
    <div className="audio-log-panel">
      <h2>Audio</h2>
      <ul>
        {messages.map((m) => (
          <li key={m.id} className={m.sender}>
            {m.sender === "user" ? "User sent audio" : "AI sent audio"}
          </li>
        ))}
      </ul>
    </div>
  );
}
