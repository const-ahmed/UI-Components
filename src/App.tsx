import { useState } from "react";
import NeuShadow from "./NeuShadow";

const BG = "#e8d9c0";

export default function App() {
  const [key, setKey] = useState(0);

  return (
    <div key={key} className="min-h-svh flex flex-col items-center">
      <div className="flex-1 flex items-center">
        <NeuShadow className="w-16 h-16 rounded-xl" bg={BG} />
      </div>
      <button onClick={() => setKey(k => k + 1)} className="text-xs text-neutral-400 cursor-pointer mb-8">
        replay
      </button>
    </div>
  );
}
