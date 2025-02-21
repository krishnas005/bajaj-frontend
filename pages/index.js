import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [inputJson, setInputJson] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]); // Array to store multiple selected filters

  const handleSubmit = async () => {
    setError("");
    setResponse(null);

    // Validate JSON input
    try {
      JSON.parse(inputJson);
    } catch (err) {
      setError("Invalid JSON input");
      return;
    }

    // Call the backend API
    try {
      const res = await axios.post("https://bajaj-backend-war0.onrender.com/bfhl", JSON.parse(inputJson));
      setResponse(res.data);
    } catch (err) {
      setError("Failed to fetch data from the backend");
    }
  };

  const handleFilterChange = (e) => {
    // Extract selected options and update the state
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedFilters(selectedOptions);
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
          <h2 className="text-xl font-bold mb-4">Enter JSON Input</h2>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder='Example: { "data": ["A", "C", "z"] }'
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
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
                multiple // Enable multiple selection
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
        </div>
      </div>
    </div>
  );
}