"use client";

import { CloseIcon } from "@/components/CloseIcon";
import { NoAgentNotification } from "@/components/NoAgentNotification";
import {
  BarVisualizer,
  DisconnectButton,
  LiveKitRoom,
  RoomAudioRenderer,
  VoiceAssistantControlBar,
} from "@livekit/components-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import type { ConnectionDetails } from "./api/connection-details/route";

// Add AgentState type
type AgentState = "disconnected" | "connecting" | "connected" | "speaking" | "listening";

export default function Page() {
  const [livekitSessions, setLivekitSessions] = useState<ConnectionDetails[]>([]);
  const [conversationCount, setConversationCount] = useState(0);

  const onConnectButtonClicked = useCallback(async () => {
    const url = new URL(
      process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? "/api/connection-details",
      window.location.origin
    );
    const response = await fetch(url.toString());
    const connectionDetails: ConnectionDetails = await response.json();
    setLivekitSessions(prev => [...prev, connectionDetails]);
    setConversationCount(prev => prev + 1);
  }, []);

  const resetCounter = () => {
    setConversationCount(0);
    setLivekitSessions([]);
  };

  return (
    <main data-lk-theme="default" className="h-full grid content-center bg-[var(--lk-bg)]">
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <span className="text-white">Active conversations: {livekitSessions.length}</span>
        <button 
          onClick={resetCounter}
          className="px-3 py-1 bg-white text-black rounded-md hover:bg-gray-200"
        >
          Reset All
        </button>
      </div>
      <div className="lk-room-container max-h-[90vh] grid grid-cols-1 gap-4">
        <div className="hidden">
          {livekitSessions.map((session) => (
            <LiveKitRoom
              key={session.roomName}
              token={session.participantToken}
              serverUrl={session.serverUrl}
              connect={true}
              audio={true}
              video={false}
              onMediaDeviceFailure={onDeviceFailure}
            >
              <SimpleVoiceAssistant />
            </LiveKitRoom>
          ))}
        </div>
        <SimpleVoiceAssistant onConnectButtonClicked={onConnectButtonClicked} />
      </div>
    </main>
  );
}

function SimpleVoiceAssistant({ onConnectButtonClicked }: { onConnectButtonClicked?: () => void }) {
  const [agentState, setAgentState] = useState<AgentState>("disconnected");

  return (
    <>
      {onConnectButtonClicked && (
        <motion.button
          initial={{ opacity: 0, top: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, top: "-10px" }}
          transition={{ duration: 1, ease: [0.09, 1.04, 0.245, 1.055] }}
          className="uppercase px-4 py-2 bg-white text-black rounded-md"
          onClick={onConnectButtonClicked}
        >
          Start a conversation
        </motion.button>
      )}

      {agentState !== "disconnected" && agentState !== "connecting" && (
        <RoomAudioRenderer />
      )}
      <NoAgentNotification state={agentState} />
      <div className="w-full px-4 py-2">
        <ControlBar agentState={agentState} />
      </div>
    </>
  );
}

function ControlBar({ agentState }: { agentState: AgentState }) {
  return (
    <div className="relative h-[100px]">
      <AnimatePresence>
        {agentState !== "disconnected" && agentState !== "connecting" && (
          <motion.div
            initial={{ opacity: 0, top: "10px" }}
            animate={{ opacity: 1, top: 0 }}
            exit={{ opacity: 0, top: "-10px" }}
            transition={{ duration: 0.4, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="flex absolute w-full h-full justify-between px-8 sm:px-4"
          >
            <BarVisualizer
              state={agentState}
              barCount={5}
              className="agent-visualizer w-24 gap-2"
              options={{ minHeight: 12 }}
            />
            <div className="flex items-center">
              <VoiceAssistantControlBar controls={{ leave: false }} />
              <DisconnectButton>
                <CloseIcon />
              </DisconnectButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function onDeviceFailure(error: Error) {
  console.error(error);
  alert(
    "Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab"
  );
}
