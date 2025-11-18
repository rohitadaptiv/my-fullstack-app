import { useEffect, useState } from "react";

function App() {
  const [pingMessage, setPingMessage] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPing = async () => {
      try {
        const res = await fetch("/ping");
        if (!res.ok) {
          throw new Error("Failed to reach backend");
        }
        const data = await res.json();
        setPingMessage(data.message);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPing();
  }, []);

  const handleSend = async () => {
    setError("");
    setResponseMessage("");
    try {
      const res = await fetch("/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: inputValue }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || "Failed to send data");
      }

      const data = await res.json();
      setResponseMessage(data.reply);
      setInputValue("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial", maxWidth: 600 }}>
      <h1>Frontend → Backend Communication Demo</h1>
      <p>GET /ping says: {pingMessage || "waiting..."}</p>

      <div style={{ marginTop: 24 }}>
        <label htmlFor="messageInput">Send data to backend:</label>
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <input
            id="messageInput"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type something"
            style={{ flex: 1, padding: 8 }}
          />
          <button onClick={handleSend} disabled={!inputValue.trim()}>
            Send
          </button>
        </div>
      </div>

      {responseMessage && (
        <p style={{ marginTop: 16 }}>Backend replied: {responseMessage}</p>
      )}

      {error && (
        <p style={{ marginTop: 16, color: "red" }}>Error: {error}</p>
      )}
    </div>
  );
}

export default App;
