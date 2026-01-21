import { useState, useEffect } from "react";

export function TimeTracker({ taskId, taskStatus }: { taskId: number; taskStatus: string }) {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (taskStatus === "completed" && isRunning) {
      setIsRunning(false);
      console.log(`Task ${taskId}: ${seconds} seconds tracked`);
    }
  }, [taskStatus, isRunning, taskId, seconds]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    console.log(`Task ${taskId}: ${seconds} seconds tracked`);
    setSeconds(0);
  };

  if (taskStatus === "completed") {
    return null;
  }

  return (
    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-zinc-800">
      <div className="text-sm font-mono text-zinc-400">{formatTime(seconds)}</div>
      {!isRunning ? (
        <button
          onClick={handleStart}
          className="text-xs px-3 py-1 bg-green-900 hover:bg-green-800 rounded text-green-300"
        >
          Start Timer
        </button>
      ) : (
        <button
          onClick={handleStop}
          className="text-xs px-3 py-1 bg-red-900 hover:bg-red-800 rounded text-red-300"
        >
          Stop Timer
        </button>
      )}
    </div>
  );
}
