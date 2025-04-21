import React, { useState, useEffect, useRef } from "react";

// Define props type
interface VoiceRecognitionProps {
  isListening: boolean;
  toggleListening: () => void;
  onCommand: (command: string) => void; // Callback function to handle the command
}

const VoiceRecognition: React.FC<VoiceRecognitionProps> = ({
  isListening,
  toggleListening,
  onCommand,
}) => {
  const [transcript, setTranscript] = useState<string>("");

  // Store the recognition instance in a ref to persist across renders
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.log("Your browser does not support speech recognition.");
      return;
    }

    // Initialize SpeechRecognition instance
    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Ensures continuous listening
    recognition.interimResults = true; // Allow interim results (while speaking)
    recognition.lang = "en-US"; // Optional: Set the language for recognition

    // Save recognition instance in the ref
    recognitionRef.current = recognition;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let currentTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);

      // Check the transcript for commands
      if (
        currentTranscript.toLowerCase().includes("turn off the light") ||
        currentTranscript.toLowerCase().includes("switch off the light") ||
        currentTranscript.toLowerCase().includes("lights off") ||
        currentTranscript.toLowerCase().includes("turn the light off") ||
        currentTranscript.toLowerCase().includes("off the light") ||
        currentTranscript.toLowerCase().includes("light off")
      ) {
        onCommand("LightOff");
      } else if (
        currentTranscript.toLowerCase().includes("turn on the light") ||
        currentTranscript.toLowerCase().includes("switch on the light") ||
        currentTranscript.toLowerCase().includes("lights on") ||
        currentTranscript.toLowerCase().includes("turn the light on") ||
        currentTranscript.toLowerCase().includes("on the light") ||
        currentTranscript.toLowerCase().includes("light on")
      ) {
        onCommand("LightOn");
      } else if (
        currentTranscript.toLowerCase().includes("close the door") ||
        currentTranscript.toLowerCase().includes("shut the door") ||
        currentTranscript.toLowerCase().includes("door close") ||
        currentTranscript.toLowerCase().includes("close the door please") ||
        currentTranscript.toLowerCase().includes("door shut")
      ) {
        onCommand("DoorClose");
      } else if (
        currentTranscript.toLowerCase().includes("open the door") ||
        currentTranscript.toLowerCase().includes("open up the door") ||
        currentTranscript.toLowerCase().includes("door open") ||
        currentTranscript.toLowerCase().includes("please open the door") ||
        currentTranscript.toLowerCase().includes("open the door please")
      ) {
        onCommand("DoorOpen");
      } else if (
        currentTranscript.toLowerCase().includes("turn off the fan") ||
        currentTranscript.toLowerCase().includes("switch off the fan") ||
        currentTranscript.toLowerCase().includes("fan off") ||
        currentTranscript.toLowerCase().includes("turn the fan off") ||
        currentTranscript.toLowerCase().includes("off the fan") ||
        currentTranscript.toLowerCase().includes("fan stop")
      ) {
        onCommand("FanOff");
      } else if (
        currentTranscript.toLowerCase().includes("turn on the fan") ||
        currentTranscript.toLowerCase().includes("switch on the fan") ||
        currentTranscript.toLowerCase().includes("turn the fan on") ||
        currentTranscript.toLowerCase().includes("activate fan") ||
        currentTranscript.toLowerCase().includes("turn on the fan low") ||
        currentTranscript.toLowerCase().includes("switch on the fan low") ||
        currentTranscript.toLowerCase().includes("fan low") ||
        currentTranscript.toLowerCase().includes("turn the fan on low") ||
        currentTranscript.toLowerCase().includes("low speed fan") ||
        currentTranscript.toLowerCase().includes("set fan to low") ||
        currentTranscript.toLowerCase().includes("activate fan low")
      ) {
        onCommand("FanLow");
      } else if (
        currentTranscript.toLowerCase().includes("turn on the fan medium") ||
        currentTranscript.toLowerCase().includes("switch on the fan medium") ||
        currentTranscript.toLowerCase().includes("fan medium") ||
        currentTranscript.toLowerCase().includes("turn the fan on medium") ||
        currentTranscript.toLowerCase().includes("medium speed fan") ||
        currentTranscript.toLowerCase().includes("set fan to medium") ||
        currentTranscript.toLowerCase().includes("activate fan medium")
      ) {
        onCommand("FanMedium");
      } else if (
        currentTranscript.toLowerCase().includes("turn on the fan high") ||
        currentTranscript.toLowerCase().includes("switch on the fan high") ||
        currentTranscript.toLowerCase().includes("fan high") ||
        currentTranscript.toLowerCase().includes("turn the fan on high") ||
        currentTranscript.toLowerCase().includes("high speed fan") ||
        currentTranscript.toLowerCase().includes("set fan to high") ||
        currentTranscript.toLowerCase().includes("activate fan high")
      ) {
        onCommand("FanHigh");
      } else if (
        currentTranscript
          .toLowerCase()
          .includes("turn off the fan completely") ||
        currentTranscript.toLowerCase().includes("stop the fan") ||
        currentTranscript.toLowerCase().includes("fan off completely") ||
        currentTranscript.toLowerCase().includes("turn off all fans") ||
        currentTranscript.toLowerCase().includes("power off the fan")
      ) {
        onCommand("FanOff");
      }
    };

    recognition.onerror = (event: SpeechRecognitionError) => {
      console.error("Speech recognition error", event.error);
    };

    // Start recognition only when isListening is true
    if (isListening) {
      recognition.start(); // Start listening
    }

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening, onCommand]);

  return (
    <div>
      <h2>Your Speech:</h2>
      <p>{transcript}</p>
    </div>
  );
};

export default VoiceRecognition;
