import { useEffect, useState } from "react";
const elements = [1, 2, 3, 4, 5, 6, 7, 8];
const arr = [...elements, ...elements];

export default function App() {
  const [array, setArr] = useState<number[]>(arr);
  const [isHiding, setHiding] = useState<boolean[]>(
    new Array(array.length).fill(true)
  );
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isBeginning, setBeginning] = useState(false);

  // function Timer() {
  //   const [count, setCount] = useState(0);

  //   useEffect(() => {
  //     const id = setInterval(() => {
  //       setCount((c) => c + 1);
  //     }, 1000);
  //     return () => {
  //       clearInterval(id);
  //     };
  //   }, []);

  //   return <p>{count}</p>;
  // }

  function generateArray() {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function handleClick(index: number) {
    if (selectedIndices.length === 2 || !isBeginning) return;

    const newHiding = [...isHiding];
    newHiding[index] = false;
    setHiding(newHiding);

    setSelectedIndices((prev) => [...prev, index]);
  }

  useEffect(() => {
    if (selectedIndices.length === 2) {
      const [first, second] = selectedIndices;
      if (array[first] === array[second]) {
        setSelectedIndices([]);
      } else {
        setTimeout(() => {
          const newHiding = [...isHiding];
          newHiding[first] = true;
          newHiding[second] = true;
          setHiding(newHiding);
          setSelectedIndices([]);
        }, 500);
      }
    }
  }, [selectedIndices, array, isHiding, isBeginning]);

  useEffect(() => {
    if (isHiding.every((status) => !status)) {
      alert("Game Over!");
      setBeginning(false);
    }
  }, [isHiding]);

  function beginGame() {
    setBeginning(true);
    setArr(generateArray());
    setHiding(new Array(array.length).fill(true));
    setSelectedIndices([]);
  }

  return (
    <div className="bg-slate-800 h-screen grid place-content-center">
      <p id="root"></p>
      <div className="grid grid-cols-4 gap-2">
        {array.map((a, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className={`h-24 w-24 rounded-lg font-bold flex justify-center items-center text-4xl ${
              isHiding[i]
                ? "bg-orange-500 text-orange-500 "
                : "bg-fuchsia-500 text-white transition "
            }`}
            disabled={!isBeginning}
          >
            {!isHiding[i] && a}
          </button>
        ))}
      </div>
      <button
        onClick={beginGame}
        className="bg-lime-600 text-white font-bold text-xl p-3 my-5 rounded-lg w-1/2 mx-auto hover:bg-opacity-80 transition disabled:cursor-not-allowed disabled:bg-slate-500"
        disabled={isBeginning}
      >
        {isBeginning ? "Stop" : "Start"}
      </button>
      <div className="group h-96 w-96 [perspective:1000px]">
        <div className="relative h-full w-full rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
          <div className="absolute">0</div>
          <div className="absolute inset-0 h-full w-full rounded-xl bg-black px-12 text-center text"></div>
        </div>
      </div>
    </div>
  );
}
