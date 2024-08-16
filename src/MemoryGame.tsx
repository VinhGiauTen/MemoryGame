import { useEffect, useState } from "react";

export default function Game() {
  const initialArray = [1, 2];
  const [array, setArray] = useState(generateArray(initialArray));
  const [isFlipped, setIsFlipped] = useState(Array(array.length).fill(false));
  const [gameStarted, setGameStarted] = useState(false);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matched, setMatched] = useState(Array(array.length).fill(false));
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [step, setStep] = useState(0);
  const [isDisable, setDisable] = useState(false);
  const [isPause, setPause] = useState(false);
  const [pauseTime, setPauseTime] = useState(0);
  const [gameOption, setOption] = useState(2);
  const [idPlay, setIdPlay] = useState(0);

  function generateArray(array: number[]) {
    const arr = [...array, ...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  function sufferArray(arr: number[]) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  function changeArrSize(gameOption: number) {
    const size = gameOption;
    const optionArr = [];
    for (let i = 1; i <= Math.pow(size, 2) / 2; i++) {
      optionArr.push(i);
    }
    console.log(optionArr);
    setArray(generateArray(optionArr));
  }

  const handleStart = () => {
    setIdPlay(idPlay + 1);
    if (gameStarted) {
      setElapsedTime(0);
      setStartTime(0);
      setFlippedIndices([]);
    } else {
      setArray(sufferArray(array));
      setIsFlipped(Array(array.length).fill(false));
      setMatched(Array(array.length).fill(false));
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

  const handlePause = () => {
    if (!isPause) {
      setPauseTime(elapsedTime);
    } else {
      setStartTime(Date.now() - pauseTime * 1000);
    }
    setPause(!isPause);
  };

  useEffect(() => {
    if (gameStarted && startTime && !isPause) {
      const timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, startTime, isPause]);

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
        setDisable(false);
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

    // const stepped = step;
    // const time = elapsedTime;
    // const sizeGame = gameOption;
    // const id = idPlay.toString();
    // localStorage.setItem(
    //   id,
    //   JSON.stringify([
    //     { time: time },
    //     { step: stepped },
    //     { size: sizeGame + "x" + sizeGame },
    //   ])
    // );
    // const obj = localStorage.getItem(id);
    // console.log(obj);
  }, [matched]);

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newGameOption = Number(event.target.value);
    setOption(newGameOption);
    changeArrSize(newGameOption);
    setIsFlipped(Array(array.length).fill(false));
    setMatched(Array(array.length).fill(false));
    setStartTime(Date.now());
    setStep(0);
    setElapsedTime(0);
    setGameStarted(false);
  };
  console.log(gameOption);
  return (
    <div className="bg-slate-800 h-screen grid place-content-center">
      <div></div>
      <div>
        {gameStarted
          ? ""
          : matched.every(Boolean) && (
              <div className="text-white text-xl my-3 text-center ">
                You won in {elapsedTime} seconds!
              </div>
            )}
      </div>
      <div className="flex justify-between my-2">
        <p className="text-white">Steps: {step}</p>
        <select
          className="p-1 rounded-md"
          value={gameOption}
          onChange={handleOptionChange}
          disabled={gameStarted}
        >
          <option value={2}>2x2</option>
          <option value={4}>4x4</option>
          <option value={6}>6x6</option>
        </select>
      </div>
      <div
        className={`grid gap-2 grid-cols-${gameOption} [perspective:1000px] `}
      >
        {array.map((a, i) => (
          <div
            key={i}
            style={{
              pointerEvents: isDisable || isPause ? "none" : "auto",
            }}
            className={`relative h-24 w-24 rounded-xl shadow-xl transition-all  [transform-style:preserve-3d] ${
              isFlipped[i]
                ? " [transform:rotateY(180deg)] duration-500 "
                : " duration-0 "
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
      <div className="flex space-x-4">
        <button
          onClick={handleStart}
          className="bg-lime-600 text-white font-bold text-xl p-3 my-5 rounded-lg w-1/2 mx-auto hover:bg-opacity-80 transition disabled:bg-slate-400 disabled:cursor-not-allowed"
          disabled={gameStarted}
        >
          {gameStarted ? (isPause ? pauseTime : elapsedTime) : "Start"}
        </button>
        <button
          onClick={handlePause}
          className="bg-lime-600 text-white font-bold text-xl p-3 my-5 rounded-lg w-1/2 mx-auto hover:bg-opacity-80 transition disabled:bg-slate-400 disabled:cursor-not-allowed"
          disabled={!gameStarted}
        >
          {isPause ? "Continue" : "Pause"}
        </button>
      </div>
    </div>
  );
}
