import { useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");
  const [retrieved, setRetrieved] = useState("");

  const handleSend = async () => {
    const res = await fetch("https://your-backend-url.replit.app/store", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input }),
    });
    const data = await res.json();
    setCode(data.code);
  };

  const handleFetch = async () => {
    const res = await fetch(`https://your-backend-url.replit.app/fetch/${code}`);
    const data = await res.json();
    setRetrieved(data.text);
  };

  return (
    <div className="App">
      <h1>String Share Tool</h1>
      
      <input
        type="text"
        placeholder="Enter text to share"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleSend}>Generate Share Code</button>

      {code && (
        <>
          <p>Code: <strong>{code}</strong></p>
          <button onClick={handleFetch}>Fetch Text</button>
        </>
      )}

      {retrieved && (
        <p><strong>Retrieved:</strong> {retrieved}</p>
      )}
    </div>
  );
}

export default App;
