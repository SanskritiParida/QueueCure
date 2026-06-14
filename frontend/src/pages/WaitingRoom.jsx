import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

function WaitingRoom() {
  const [queue, setQueue] = useState([]);
  const [currentToken, setCurrentToken] = useState("");
  const [avgTime, setAvgTime] = useState(5);

  useEffect(() => {

    // Initial load from localStorage
    const storedQueue =
      JSON.parse(localStorage.getItem("queue")) || [];

    const storedToken =
      localStorage.getItem("currentToken") || "";

    const storedAvg =
      Number(localStorage.getItem("avgTime")) || 5;

    setQueue(storedQueue);
    setCurrentToken(storedToken);
    setAvgTime(storedAvg);

    // Listen for live queue updates
    socket.on(
      "queueUpdated",
      (data) => {
        setQueue(data);
      }
    );

    // Listen for current patient updates
    socket.on(
      "currentTokenUpdated",
      (data) => {
        setCurrentToken(data);
      }
    );

    return () => {
      socket.off("queueUpdated");
      socket.off("currentTokenUpdated");
    };

  }, []);

  return (
    <div className="waiting-room">

      <h1>🏥 QueueCure Waiting Room</h1>

      <p className="waiting-subtitle">
        Live queue updates for patients
      </p>

      <div className="waiting-card">
        <h2>🟢 Now Serving</h2>
        <p>{currentToken || "No Patient"}</p>
      </div>

      <div className="waiting-card">
        <h2>Patients Waiting</h2>
        <p>{queue.length}</p>
      </div>

      <div className="waiting-card">
        <h2>Estimated Wait</h2>
        <p>
          {queue.length === 0
            ? "No Waiting"
            : `${queue.length * avgTime} mins`}
        </p>
      </div>

    </div>
  );
}

export default WaitingRoom;