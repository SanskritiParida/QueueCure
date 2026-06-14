import { io } from "socket.io-client";
import { useState, useEffect } from "react";
const socket = io("http://localhost:3001");

function Receptionist() {
    const [patientName, setPatientName] = useState("");
    const [queue, setQueue] = useState([]);
    const [servedCount, setServedCount] = useState(0);
    const [currentToken, setCurrentToken] = useState("");
    const [nextToken, setNextToken] = useState(1);
    const [avgTime, setAvgTime] = useState(5);
    const [isLoaded, setIsLoaded] = useState(false);
    const [searchToken, setSearchToken] = useState("");
    const [searchResult, setSearchResult] = useState(null);
    const [removeToken, setRemoveToken] = useState("");


    useEffect(() => {
        const storedQueue = JSON.parse(localStorage.getItem("queue")) || [];
        const storedCurrent = localStorage.getItem("currentToken") || "";
        const storedAvg = Number(localStorage.getItem("avgTime")) || 5;
        const storedNextToken = Number(localStorage.getItem("nextToken")) || 1;
        const storedServed = Number(localStorage.getItem("servedCount")) || 0;

        setQueue(storedQueue);
        setCurrentToken(storedCurrent);
        setAvgTime(storedAvg);
        setNextToken(storedNextToken);
        setServedCount(storedServed);

        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (!isLoaded) return;

        localStorage.setItem("queue", JSON.stringify(queue));
        localStorage.setItem("currentToken", currentToken || "");
        localStorage.setItem("avgTime", avgTime);
        localStorage.setItem("nextToken", nextToken);
        localStorage.setItem("servedCount", servedCount);
    }, [queue, currentToken, avgTime, nextToken, servedCount, isLoaded]);

    const addPatient = () => {
        if (patientName.trim() === "") return;

        const formattedName =
            patientName.trim().charAt(0).toUpperCase() +
            patientName.trim().slice(1).toLowerCase();

        const updatedQueue = [
            ...queue,
            {
                token: nextToken,
                name: formattedName,
            },
        ];

        setQueue(updatedQueue);

        socket.emit("queueUpdated", updatedQueue);

        setNextToken((prev) => prev + 1);
        setPatientName("");
    };

    const callNext = () => {
        if (queue.length === 0) return;

        const updatedQueue = queue.slice(1);

        setCurrentToken(queue[0].name);

        setQueue(updatedQueue);

        socket.emit(
            "queueUpdated",
            updatedQueue
        );

        socket.emit(
            "currentTokenUpdated",
            queue[0].name
        );

        setServedCount((prev) => prev + 1);
    };

    const findToken = () => {

        const position = queue.findIndex(
            patient => patient.token === Number(searchToken)
        );

        if (position === -1) {
            setSearchResult("Token Not Found");
            return;
        }

        setSearchResult({
            position: position + 1,
            ahead: position,
            wait: position * avgTime
        });
    };
    const cancelToken = () => {

        const updatedQueue =
            queue.filter(
                patient =>
                    patient.token !== Number(removeToken)
            );

        setQueue(updatedQueue);
        socket.emit(
            "queueUpdated",
            updatedQueue
        );

        setRemoveToken("");
    };

    return (
        <div className="dashboard">
            <h1>QueueCure</h1>

            <p className="tagline">
                Streamline clinic operations with live queue tracking, intelligent
                wait-time estimation, and real-time patient updates.
            </p>

            <div className="stats">
                <div className="card">
                    <h3>Currently Serving</h3>
                    <p>{currentToken || "No Patient"}</p>
                </div>
                <div className="card">
                    <h3>Next Patient</h3>

                    {queue.length > 0 ? (
                        <>
                            <p className="next-name">
                                👤 {queue[0].name}
                            </p>

                            <p className="next-token">
                                Token #{queue[0].token}
                            </p>
                        </>
                    ) : (
                        <p>No Queue</p>
                    )}
                </div>
                <div className="card">
                    <h3>Patients Served</h3>
                    <p>{servedCount}</p>
                </div>

                <div className="card">
                    <h3>Avg Consultation</h3>
                    <p>{avgTime} mins</p>
                </div>

                <div className="card">
                    <h3>Estimated Wait</h3>
                    <p>
                        {queue.length === 0 ? "0 mins" : `${queue.length * avgTime} mins`}
                    </p>
                </div>

                <div className="card">
                    <h3>Patients Waiting</h3>
                    <p>{queue.length}</p>
                </div>
            </div>

            <div className="add-patient">
                <input
                    type="number"
                    value={avgTime}
                    onChange={(e) => setAvgTime(Number(e.target.value) || 1)}
                    placeholder="Avg consultation time"
                />

                <input
                    type="text"
                    placeholder="Enter patient name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                />

                <button onClick={addPatient}>Add Patient</button>
            </div>
            <div className="tools-container">
                <div className="search-box">

                    <h2>Find Your Token</h2>

                    <input
                        type="number"
                        placeholder="Enter Token Number"
                        value={searchToken}
                        onChange={(e) =>
                            setSearchToken(e.target.value)
                        }
                    />

                    <button onClick={findToken}>
                        Search
                    </button>

                    {searchResult && (
                        <div className="search-result">

                            {typeof searchResult === "string" ? (
                                <p>{searchResult}</p>
                            ) : (
                                <>
                                    <p>
                                        Position: {searchResult.position}
                                    </p>

                                    <p>
                                        Patients Ahead: {searchResult.ahead}
                                    </p>

                                    <p>
                                        Estimated Wait: {searchResult.wait} mins
                                    </p>
                                </>
                            )}

                        </div>
                    )}

                </div>
                <div className="search-box">

                    <h2>Cancel Token</h2>

                    <input
                        type="number"
                        placeholder="Enter Token Number"
                        value={removeToken}
                        onChange={(e) =>
                            setRemoveToken(e.target.value)
                        }
                    />

                    <button onClick={cancelToken}>
                        Cancel Token
                    </button>

                </div>
            </div>

            <div className="queue-card">
                <h2>Current Queue</h2>

                <ul>
                    {queue.map((patient) => (
                        <li key={patient.token}>
                            <p>🎟 Token #{patient.token}</p>
                            <p className="patient-name">👤 {patient.name}</p>
                        </li>
                    ))}
                </ul>

                <button onClick={callNext} disabled={queue.length === 0}>
                    Call Next
                </button>
            </div>
        </div>
    );
}

export default Receptionist;