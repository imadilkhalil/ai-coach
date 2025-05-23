/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useRef, useState } from "react";
import "./App.scss";
import { useLiveAPIContext } from "./contexts/LiveAPIContext";
import SidePanel from "./components/side-panel/SidePanel";
import ControlTray from "./components/control-tray/ControlTray";
import LandingPage, { Persona } from "./components/landing/LandingPage";
import AudioLogPanel from "./components/audio-log-panel/AudioLogPanel";
import cn from "classnames";
import { useMsal } from "@azure/msal-react";

function App() {
  const { setConfig, config } = useLiveAPIContext();
  const [persona, setPersona] = useState<Persona | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const { instance, accounts, inProgress } = useMsal();

  const personaInstructions: Record<Persona, string> = {
    prospect:
      "You are a potential customer receiving a cold call. Respond realistically to help practice introductions.",
    lead:
      "You are a business lead evaluating a company. Engage in discussion and raise objections when appropriate.",
    candidate:
      "You are a job candidate speaking with a recruiter about an open role.",
  };

  const handleSelect = (p: Persona) => {
    setConfig({
      ...config,
      systemInstruction:
        (typeof config.systemInstruction === "string"
          ? config.systemInstruction
          : "") + `\n\n${personaInstructions[p]}`,
    });
    setPersona(p);
  };

  if (!persona) {
    return <LandingPage onSelect={handleSelect} />;
  }

  return (
    <div className="App">
      <div className="streaming-console">
        <div className="header">{accounts[0]?.name}</div>
        <SidePanel />
        <main>
          <div className="main-app-area">
            <video
              className={cn("stream", {
                hidden: !videoRef.current || !videoStream,
              })}
              ref={videoRef}
              autoPlay
              playsInline
            />
          </div>

          <ControlTray
            videoRef={videoRef}
            supportsVideo={true}
            onVideoStreamChange={setVideoStream}
            enableEditingSettings={true}
          ></ControlTray>
        </main>
        <AudioLogPanel />
      </div>
    </div>
  );
}

export default App;
