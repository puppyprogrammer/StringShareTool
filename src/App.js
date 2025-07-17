import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./App.css";

const supabaseUrl = "https://mlxjlakdwsrrshxkyeas.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1seGpsYWtkd3NycnNoeGt5ZWFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NDQwMzUsImV4cCI6MjA2ODMyMDAzNX0.jVcFx0cCwbi-gsKywo4fvmttCVk6qteOdBKxWYjM4mc";

const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");
  const [retrieved, setRetrieved] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateCode = () => Math.random().toString(36).slice(2, 8);

  const handleSend = async () => {
    if (!input.trim()) {
      setError("Please enter a string to share.");
      return;
    }
    setLoading(true);
    setError("");
    const newCode = generateCode();
    const { error } = await supabase.from("shared_strings").insert([
      { code: newCode, text: input.trim() },
    ]);
    setLoading(false);
    if (error) {
      setError("Failed to save string: " + error.message);
      return;
    }
    setCode(newCode);
    setRetrieved("");
    setInput("");
  };

  const handleFetch = async () => {
    if (!code.trim()) {
      setError("Please enter a code to fetch.");
      return;
    }
    setLoading(true);
    setError("");
    const { data, error } = await supabase
      .from("shared_strings")
      .select("text")
      .eq("code", code.trim())
      .single();
    setLoading(false);
    if (error) {
      setError("Failed to retrieve string: " + error.message);
      return;
    }
    setRetrieved(data.text);
  };

  return (
    <>
      <header>StringShareTool</header>
      <div className="app-container">
        <section className="share-section">
          <textarea
            placeholder="Enter text or URL to share"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            className="input-textarea"
          />
          <button onClick={handleSend} disabled={loading} className="btn-primary">
            {loading ? "Saving..." : "Generate Share Code"}
          </button>
        </section>

        {code && (
          <section className="code-section">
            <p>
              <strong>Your share code:</strong>{" "}
              <span className="code">{code}</span>
            </p>
            <input
              type="text"
              placeholder="Enter share code to fetch text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="input-code"
            />
            <button onClick={handleFetch} disabled={loading} className="btn-secondary">
              {loading ? "Fetching..." : "Fetch Text"}
            </button>
          </section>
        )}

        {retrieved && (
          <section className="result-section">
            <h3>Retrieved Text:</h3>
            <div className="retrieved-text">{retrieved}</div>
          </section>
        )}

        {error && <p className="error-msg">{error}</p>}
      </div>
    </>
  );
}

export default App;
