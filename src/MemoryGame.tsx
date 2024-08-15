import { useEffect, useState } from "react";

export default function Game() {
  const initialArray = [1, 2, 3, 4, 5, 6, 7, 8];
  const [array, setArray] = useState(generateArray(initialArray));
  const [isFlipped, setIsFlipped] = useState(Array(array.length).fill(false));
  const [gameStarted, setGameStarted] = useState(false);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matched, setMatched] = useState(Array(array.length).fill(false));
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [step, setStep] = useState(0);
  const [isDisable, setDisable] = useState(false);

  function generateArray(array: number[]) {
    const arr = [...array, ...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const handleStart = () => {
    if (gameStarted) {
      setElapsedTime(0);
      setStartTime(0);
      setFlippedIndices([]);
    } else {
      setIsFlipped(Array(array.length).fill(false));
      setMatched(Array(array.length).fill(false));
      setArray(generateArray(initialArray));
      setStartTime(Date.now());
      setStep(0);
    }
    setGameStarted(!gameStarted);
  };

  const handleClick = (index: number) => {
    if (gameStarted && !isFlipped[index] && flippedIndices.length < 2) {
      setIsFlipped((prev) => {
        const newFlipped = [...prev];
        newFlipped[index] = true;
        return newFlipped;
      });
      setFlippedIndices((prev) => [...prev, index]);
    }
  };

  useEffect(() => {
    if (gameStarted && startTime) {
      const timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, startTime]);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      setDisable(true);
      const [firstIndex, secondIndex] = flippedIndices;
      if (array[firstIndex] === array[secondIndex]) {
        setMatched((prev) => {
          const newMatched = [...prev];
          newMatched[firstIndex] = true;
          newMatched[secondIndex] = true;
          return newMatched;
        });
        setTimeout(() => {
          setDisable(false);
        }, 500);
      } else {
        setTimeout(() => {
          setIsFlipped((prev) => {
            const newFlipped = [...prev];
            newFlipped[firstIndex] = false;
            newFlipped[secondIndex] = false;
            return newFlipped;
          });
          setDisable(false);
        }, 500);
      }
      setFlippedIndices([]);
      setStep(step + 1);
    }
  }, [flippedIndices, array]);

  useEffect(() => {
    if (matched.every(Boolean)) {
      setGameStarted(false);
    }
  }, [matched]);

  return (
    <div className="bg-slate-800 h-screen grid place-content-center">
      {gameStarted
        ? ""
        : matched.every(Boolean) && (
            <div className="text-white text-xl my-3 text-center ">
              You won in {elapsedTime} seconds!
            </div>
          )}
      <p className="text-white my-1">Steps: {step}</p>
      <div className="grid grid-cols-4 gap-2 [perspective:1000px]">
        {array.map((a, i) => (
          <div
            key={i}
            style={{
              pointerEvents: isDisable ? "none" : "auto",
            }}
            className={`relative h-24 w-24 rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d] ${
              isFlipped[i] ? "[transform:rotateY(180deg)]" : "duration-0"
            }`}
          >
            <div
              className={`absolute inset-0 h-full w-full rounded-lg font-bold flex justify-center items-center text-4xl bg-orange-500 [backface-visibility:hidden]`}
              onClick={() => handleClick(i)}
            ></div>
            <div
              className={`absolute inset-0 h-full w-full rounded-lg font-bold flex justify-center items-center text-4xl ${
                matched[i] ? "bg-blue-500 transition " : "bg-fuchsia-500"
              } text-white px-12 text-center [transform:rotateY(180deg)] [backface-visibility:hidden]`}
            >
              {a}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleStart}
        className="bg-lime-600 text-white font-bold text-xl p-3 my-5 rounded-lg w-1/2 mx-auto hover:bg-opacity-80 transition disabled:bg-slate-400 disabled:cursor-not-allowed"
        disabled={gameStarted}
      >
        {gameStarted ? elapsedTime : "Start"}
      </button>
    </div>
  );
}
