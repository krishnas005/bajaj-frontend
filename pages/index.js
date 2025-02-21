import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [inputJson, setInputJson] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);

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

  const handleFilterChange = (filter) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const renderResponse = () => {
    if (!response) return null;

    const { numbers, alphabets, highest_alphabet } = response;

    return (
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Response</h2>
        {selectedFilters.includes("numbers") && (
          <div>
            <h3 className="font-semibold">Numbers</h3>
            <p>{numbers.join(", ")}</p>
          </div>
        )}
        {selectedFilters.includes("alphabets") && (
          <div>
            <h3 className="font-semibold">Alphabets</h3>
            <p>{alphabets.join(", ")}</p>
          </div>
        )}
        {selectedFilters.includes("highest_alphabet") && (
          <div>
            <h3 className="font-semibold">Highest Alphabet</h3>
            <p>{highest_alphabet.join(", ")}</p>
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
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            rows="4"
            placeholder='Example: { "data": ["A", "C", "z"] }'
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Submit
          </button>

          {response && (
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-4">Filters</h2>
              <div className="flex space-x-4">
                {["numbers", "alphabets", "highest_alphabet"].map((filter) => (
                  <label key={filter} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedFilters.includes(filter)}
                      onChange={() => handleFilterChange(filter)}
                      className="mr-2"
                    />
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </label>
                ))}
              </div>
              {renderResponse()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}