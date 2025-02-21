import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [inputJson, setInputJson] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const exampleJson = `{ "data": ["M", "1", "334", "4", "B"] }`; // Example input

  useEffect(() => {
    document.title = "22BCS11885";
  }, []);

  const handleSubmit = async () => {
    setError("");
    setResponse(null);

    let parsedData;
    try {
      parsedData = JSON.parse(inputJson);
      if (!parsedData.data || !Array.isArray(parsedData.data)) {
        setError("Input must contain a 'data' array");
        return;
      }
    } catch (err) {
      setError("Invalid JSON input");
      return;
    }

    try {
      const res = await axios.post(
        "https://bajaj-backend-war0.onrender.com/bfhl",
        parsedData,
        { timeout: 10000 }
      );
      setResponse(res.data);
    } catch (err) {
      console.error("API error:", err);

      if (err.code === "ECONNABORTED" || err.message.includes("Network Error") || !err.response) {
        const data = parsedData.data;
        const numbers = data.filter(item => !isNaN(item));
        const alphabets = data.filter(item => isNaN(item) && item.length === 1 && /^[A-Za-z]$/.test(item));
        const highestAlphabet = alphabets.length > 0 ? 
          [alphabets.sort((a, b) => b.toLowerCase().localeCompare(a.toLowerCase()))[0]] : [];

        const fallbackResponse = {
          is_success: true,
          user_id: "krishnas05",
          email: "22BCS11885@cuchd.in",
          roll_number: "22BCS11885",
          numbers,
          alphabets,
          highest_alphabet: highestAlphabet
        };

        setResponse(fallbackResponse);
      } else {
        setError(`API Error: ${err.response?.data?.error || err.message}`);
      }
    }
  };

  const handleFilterChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedFilters(selectedOptions);
  };

  const handleCopyExample = () => {
    setInputJson(exampleJson);
    navigator.clipboard.writeText(exampleJson).then(() => {
      alert("Example JSON copied to clipboard!");
    });
  };

  const renderResponse = () => {
    if (!response) return null;

    const { numbers, alphabets, highest_alphabet } = response;

    return (
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Response</h2>
        {selectedFilters.includes("numbers") && (
          <div className="mb-4">
            <h3 className="font-semibold">Numbers</h3>
            <p className="bg-gray-100 p-2 rounded-md">{numbers.join(", ")}</p>
          </div>
        )}
        {selectedFilters.includes("alphabets") && (
          <div className="mb-4">
            <h3 className="font-semibold">Alphabets</h3>
            <p className="bg-gray-100 p-2 rounded-md">{alphabets.join(", ")}</p>
          </div>
        )}
        {selectedFilters.includes("highest_alphabet") && (
          <div className="mb-4">
            <h3 className="font-semibold">Highest Alphabet</h3>
            <p className="bg-gray-100 p-2 rounded-md">{highest_alphabet.join(", ")}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Krishna Sharma - 22BCS11885</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Example JSON Input</h2>
          <div className="bg-gray-200 p-4 rounded-md relative mb-4">
            <pre className="text-sm">{exampleJson}</pre>
            <button
              className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs rounded-md hover:bg-blue-600"
              onClick={handleCopyExample}
            >
              Copy
            </button>
          </div>
          <h2 className="text-xl font-bold mb-4">Enter JSON Input</h2>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder='Example: { "data": ["A", "C", "z"] }'
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
          />
          {error && (
            <div className={`mb-4 p-2 rounded-md ${error.includes("locally") ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-500"}`}>
              {error}
            </div>
          )}
          <button
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleSubmit}
          >
            Submit
          </button>

          {response && (
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-4">Filters</h2>
              <select
                multiple
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedFilters}
                onChange={handleFilterChange}
              >
                <option value="numbers">Numbers</option>
                <option value="alphabets">Alphabets</option>
                <option value="highest_alphabet">Highest Alphabet</option>
              </select>
              <p className="text-sm text-gray-500 mt-2">Hold Ctrl (Windows) or Command (Mac) to select multiple options.</p>
              {renderResponse()}
            </div>
          )}
          {response && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h3 className="font-semibold">User Information</h3>
              <p><strong>User ID:</strong> {response.user_id}</p>
              <p><strong>Email:</strong> {response.email}</p>
              <p><strong>Roll Number:</strong> {response.roll_number}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
