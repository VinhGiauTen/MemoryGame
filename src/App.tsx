import { useEffect, useState } from "react";
const elements = [1, 2, 3, 4, 5, 6, 7, 8];
const arr = [...elements, ...elements];

function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => c + 1);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

  return <p>{count}</p>;
}
export default function App() {
  const [array, setArr] = useState(arr);
  const [isBegining, setBegining] = useState(false);
  const [isHiding, setHiding] = useState(new Array(array.length).fill(true));

  const generateArray = () => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  function Hide(id: number) {
    setHiding((prev) =>
      prev.map((status, index) => (index === id ? !status : status))
    );
  }

  function Begin() {
    setBegining((status) => !status);
    setArr(generateArray());
    setHiding(new Array(array.length).fill(true));
  }

  return (
    <div className="bg-slate-800 h-screen grid place-content-center">
      <div className="grid grid-cols-4 gap-2">
        {array.map((a, i) => (
          <button
            key={i}
            onClick={() => Hide(i)}
            className={`h-24 w-24 rounded-lg font-bold flex justify-center items-center text-4xl ${
              isHiding[i]
                ? "bg-orange-500 text-orange-500"
                : "bg-fuchsia-500 text-white transition"
            }`}
            disabled={!isBegining}
          >
            {a}
          </button>
        ))}
      </div>
      <button
        onClick={Begin}
        className="bg-lime-600 text-white font-bold text-xl p-3 my-5 rounded-lg w-1/2 mx-auto hover:bg-opacity-80 transition disabled:cursor-not-allowed disabled:bg-slate-500"
        // disabled={isBegining}
      >
        {isBegining ? <Timer /> : "Start"}
      </button>
    </div>
  );
}
