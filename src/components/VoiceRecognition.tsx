import React, { useState, useEffect, useRef, useCallback } from "react";

// Define props type
interface VoiceRecognitionProps {
  isListening: boolean;
  onCommand: (command: string) => void;
}

// Command structure
interface CommandWithTimestamp {
  action: string;
  timestamp: number;
}

const VoiceRecognition: React.FC<VoiceRecognitionProps> = ({
  isListening,
  onCommand,
}) => {
  const [transcript, setTranscript] = useState<string>("");
  const [scheduledCommands, setScheduledCommands] = useState<
    CommandWithTimestamp[]
  >([]);

  // Store the recognition instance in a ref to persist across renders (avoiding re-initialization)
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Define a list of possible commands that the app will recognize
  const commandMappings = useRef([
    { command: "turn on the light", action: "LightOn" },
    { command: "turn off the light", action: "LightOff" },
    { command: "open the door", action: "DoorOpen" },
    { command: "close the door", action: "DoorClose" },
    { command: "turn on the fan low", action: "FanLow" },
    { command: "turn on the fan medium", action: "FanMedium" },
    { command: "turn on the fan high", action: "FanHigh" },
    { command: "turn off the fan", action: "FanOff" },
    { command: "clear", action: "Clear" },
  ]);

  // Function to parse time from the command transcript
  const parseTime = (currentTranscript: string): number => {
    let delayInMs = 0;

    // Match for exact time in HH:mm format (e.g., "at 14:30")
    const timeMatch = currentTranscript.match(/at\s*(\d{1,2}):(\d{2})/);
    if (timeMatch) {
      const [_, hours, minutes] = timeMatch;
      const now = new Date();
      const targetTime = new Date(now);
      targetTime.setHours(parseInt(hours), parseInt(minutes), 0);

      delayInMs = targetTime.getTime() - now.getTime();

      // If the target time has already passed, schedule it for the next day
      if (delayInMs < 0) {
        delayInMs += 24 * 60 * 60 * 1000;
      }
    } else {
      // Match for relative times like "10 seconds", "5 minutes", or "2 hours"
      const relativeTimeMatch = currentTranscript.match(
        /(\d+)\s*(seconds?|minutes?|hours?)/
      );
      if (relativeTimeMatch) {
        const amount = parseInt(relativeTimeMatch[1], 10);
        const unit = relativeTimeMatch[2].toLowerCase();

        if (unit.includes("second")) {
          delayInMs = amount * 1000; // Convert seconds to milliseconds
        } else if (unit.includes("minute")) {
          delayInMs = amount * 60 * 1000; // Convert minutes to milliseconds
        } else if (unit.includes("hour")) {
          delayInMs = amount * 60 * 60 * 1000; // Convert hours to milliseconds
        }
      }
    }

    return delayInMs;
  };

  // Function to handle matching the command and executing corresponding actions
  const matchCommand = (currentTranscript: string) => {
    for (let { command, action } of commandMappings.current) {
      if (currentTranscript.toLowerCase().includes(command)) {
        if (command === "clear") {
          console.log("Clearing scheduled commands.");
          setScheduledCommands([]); // Reset scheduled commands
          return;
        }

        const delayInMs = parseTime(currentTranscript); // Get the delay based on the transcript

        // Store the action and its timestamp
        const newCommand = {
          action,
          timestamp: Date.now() + delayInMs,
        };

        setScheduledCommands((prevCommands) => [...prevCommands, newCommand]);
        console.log(`Scheduled action: ${action} at ${newCommand.timestamp}`);
        break;
      }
    }
  };

  // Memoize the command handler to avoid unnecessary re-renders
  const handleCommand = useCallback((currentTranscript: string) => {
    matchCommand(currentTranscript);
  }, []);

  // Function to check and execute commands at their scheduled times
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now();

      // console.log("Scheduled Commands:", scheduledCommands);

      const commandsToExecute = scheduledCommands.filter(
        (command) => command.timestamp <= now
      );

      // Execute commands that are ready to run
      commandsToExecute.forEach((command) => {
        console.log(`Executing action: ${command.action}`);
        onCommand(command.action);
      });

      // Remove executed commands from the list
      setScheduledCommands((prevCommands) =>
        prevCommands.filter((command) => command.timestamp > now)
      );
    }, 1000); // Check every second

    return () => clearInterval(intervalId);
  }, [scheduledCommands, onCommand]);

  // Initialize speech recognition and handle the voice commands
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognitionRef.current = recognition;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let currentTranscript =
        event.results[event.results.length - 1][0].transcript;
      setTranscript(currentTranscript);
      handleCommand(currentTranscript);
    };

    recognition.onerror = (event: SpeechRecognitionError) => {
      console.error("Speech recognition error", event.error);
    };

    if (isListening) {
      recognition.start();
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
