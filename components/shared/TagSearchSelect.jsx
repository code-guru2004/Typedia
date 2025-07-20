"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import debounce from "lodash.debounce";

export default function TagSearchSelect({ selectedTags, setSelectedTags }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch tags based on search query (debounced)
    const fetchTags = debounce(async (q) => {
        if (!q) {
            setResults([]);
            return;
        }
        setLoading(true);
        try {
            const res = await axios.get(`/api/tag/search?query=${q}`);
            setResults(res.data.tags || []);
        } catch (err) {
            console.error("Tag search failed:", err);
        } finally {
            setLoading(false);
        }
    }, 300);

    useEffect(() => {
        fetchTags(query);
        return () => fetchTags.cancel();
    }, [query]);

    const handleSelect = (tag) => {
        if (!selectedTags.find((t) => t._id === tag._id)) {
            setSelectedTags([...selectedTags, tag]);
        }
        setQuery("");
        setResults([]);
    };

    const handleRemove = (id) => {
        setSelectedTags(selectedTags.filter((t) => t._id !== id));
    };

    return (
        <div className="space-y-2">
            <label htmlFor="tags">Tags</label>
            <input
                id="tags"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tags..."
                className="w-full border px-3 py-2 rounded"
            />

            {loading && <p className="text-sm text-gray-500">Loading...</p>}

            {results.length > 0 && (
                <ul className="border rounded bg-white max-h-40 overflow-y-auto">
                    {results.map((tag) => (
                        <li
                            key={tag._id}
                            className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelect(tag)}
                        >
                            {tag.name}
                        </li>
                    ))}
                </ul>
            )}

            {/* Selected Tags */}
            <div className="flex flex-wrap gap-2 mt-2">
                {selectedTags.map((tag) => (
                    <span
                        key={tag._id}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center "
                    >
                        #{tag.name}
                        <button
                            onClick={() => handleRemove(tag._id)}
                            className="ml-2 text-red-600 text-sm"
                        >
                            ✕
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
}
