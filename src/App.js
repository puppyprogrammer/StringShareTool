import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mlxjlakdwsrrshxkyeas.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1seGpsYWtkd3NycnNoeGt5ZWFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NDQwMzUsImV4cCI6MjA2ODMyMDAzNX0.jVcFx0cCwbi-gsKywo4fvmttCVk6qteOdBKxWYjM4mc";  // replace this with your anon key
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");
  const [retrieved, setRetrieved] = useState("");

  const handleSend = async () => {
    const newCode = Math.random().toString(36).slice(2, 8);
    const { error } = await supabase.from("shared_strings").insert([
      { code: newCode, text: input.trim() },
    ]);
    if (error) {
      alert("Failed to save string: " + error.message);
      return;
    }
    setCode(newCode);
  };

  const handleFetch = async () => {
    const { data, error } = await supabase
      .from("shared_strings")
      .select("text")
      .eq("code", code)
      .single();
    if (error) {
      alert("Failed to retrieve string: " + error.message);
      return;
    }
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
          <p>
            Code: <strong>{code}</strong>
          </p>
          <input
            type="text"
            placeholder="Enter code to fetch"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button onClick={handleFetch}>Fetch Text</button>
        </>
      )}

      {retrieved && (
        <p>
          <strong>Retrieved:</strong> {retrieved}
        </p>
      )}
    </div>
  );
}

export default App;
