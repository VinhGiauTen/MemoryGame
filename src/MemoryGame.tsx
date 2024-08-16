import { useEffect, useState } from "react";

type Archie = {
  id: number;
  step: number;
  time: number;
  size: string;
};

type Stage = {
  step: number;
  gameOption: number;
  array: string;
  elapsedTime: number;
  flippedIndices: string;
  matched: string;
  isFlipped: string;
  isPause: string;
};

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
  const [idPlay, setIdPlay] = useState(() => {
    const savedId = localStorage.getItem("idPlay");
    return savedId ? Number(savedId) : 0;
  });
  const [archie, setArchie] = useState<Archie[]>([]);
  const [sortOption, setSortOption] = useState("");

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

  const handleRestore = () => {
    const existingStage = JSON.parse(
      localStorage.getItem("Game Stage") || "[]"
    );
    existingStage.forEach((e: Stage) => {
      setArray(JSON.parse(e.array));
      setFlippedIndices(JSON.parse(e.flippedIndices));
      setStep(e.step);
      setOption(e.gameOption);
      setElapsedTime(e.elapsedTime);
      setMatched(JSON.parse(e.matched));
      setIsFlipped(JSON.parse(e.isFlipped));
      setPause(Boolean(e.isPause));
    });
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
    if (!matched.every(Boolean)) {
      const gameStage = {
        step: step,
        gameOption: gameOption,
        array: JSON.stringify(array),
        elapsedTime: elapsedTime,
        flippedIndices: JSON.stringify(flippedIndices),
        matched: JSON.stringify(matched),
        isFlipped: JSON.stringify(isFlipped),
        isPause: isPause,
      };
      localStorage.setItem("Game Stage", JSON.stringify(gameStage));
    }
  }, [flippedIndices, array]);

  useEffect(() => {
    localStorage.setItem("idPlay", idPlay.toString());
  }, [idPlay]);

  useEffect(() => {
    const existingData = JSON.parse(
      localStorage.getItem("Memory Game") || "[]"
    );
    setArchie(existingData);
  }, []);

  useEffect(() => {
    if (matched.every(Boolean)) {
      setGameStarted(false);

      const stepped = step;
      const time = elapsedTime;
      const sizeGame = gameOption;
      const id = idPlay;

      const existingData = JSON.parse(
        localStorage.getItem("Memory Game") || "[]"
      );

      const isGameAlreadySaved = existingData.some(
        (game: Archie) =>
          game.id === id && game.size === sizeGame + "x" + sizeGame
      );
      if (!isGameAlreadySaved) {
        const newGameData = {
          id: id,
          time: time,
          step: stepped,
          size: sizeGame + "x" + sizeGame,
        };
        const updatedData = [...existingData, newGameData];
        localStorage.setItem("Memory Game", JSON.stringify(updatedData));
        setArchie(updatedData);
      }
    }
  }, [matched.every(Boolean)]);

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

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };
  const sortedResults = [...archie].sort((a, b) => b.id - a.id);
  const latestResults = sortedResults.slice(0, 10).sort((a, b) => a.id - b.id);
  const gameResults = [...latestResults].sort((a, b) => {
    if (sortOption === "step") {
      return a.step - b.step;
    }
    if (sortOption === "time") {
      return a.time - b.time;
    }
    if (sortOption === "size") {
      const sizeA = parseFloat(a.size.replace(/[^0-9]/g, ""));
      const sizeB = parseFloat(b.size.replace(/[^0-9]/g, ""));
      return sizeA - sizeB;
    }
    return 0;
  });

  return (
    <div className="bg-slate-800 h-full xl:h-screen grid xl:items-center">
      <div className="xl:absolute top-5 left-10 xl:w-1/5">
        <div className="flex justify-between p-3">
          <div className="text-white font-semibold text-xl m-1">
            Top Ranking
          </div>
          <select
            className="p-1 rounded-md"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value={""}>Sắp xếp theo</option>
            <option value={"step"}>Step</option>
            <option value={"time"}>Time</option>
            <option value={"size"}>Size</option>
          </select>
        </div>
        <div className="table p-5 text-white w-full text-lg">
          <div className="table-header-group font-semibold">
            <div className="table-row">
              <div className="table-cell text-left">Player</div>
              <div className="table-cell text-left">Step</div>
              <div className="table-cell text-left">Time</div>
              <div className="table-cell text-left">Size</div>
            </div>
          </div>
          <div className="table-row-group">
            {gameResults.map((a) => (
              <div className="table-row" key={a.id}>
                <div className="table-cell">{a.id}</div>
                <div className="table-cell">{a.step}</div>
                <div className="table-cell">{a.time}</div>
                <div className="table-cell">{a.size}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <hr className="p-3 w-11/12 mx-auto xl:hidden" />
      <div className="p-3 xl:w-1/3 xl:mx-auto">
        <div>
          {gameStarted
            ? ""
            : matched.every(Boolean) && (
                <div className="text-white text-2xl font-bold my-3 text-center ">
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
          className={`grid  ${
            gameOption === 2
              ? "grid-cols-2 gap-2 w-1/3 mx-auto  "
              : gameOption === 4
              ? "grid-cols-4 gap-1 w-2/3 mx-auto "
              : "grid-cols-6 gap-1 "
          } xl:gap-2 [perspective:1000px]`}
        >
          {array.map((a, i) => (
            <div
              key={i}
              style={{
                pointerEvents: isDisable || isPause ? "none" : "auto",
              }}
              className={`relative h-16 w-16 xl:h-24 xl:w-24 rounded-xl shadow-xl transition-all [transform-style:preserve-3d] ${
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
                className={`absolute inset-0 h-full w-full rounded-lg font-bold flex justify-center items-center text-3xl xl:text-4xl ${
                  matched[i] ? "bg-blue-500 transition " : "bg-fuchsia-500"
                } text-white xl:px-12 text-center [transform:rotateY(180deg)] [backface-visibility:hidden]`}
              >
                {a}
              </div>
            </div>
          ))}
        </div>
        <div className="flex space-x-4 my-5">
          <button
            onClick={handleStart}
            className="bg-lime-600 text-white font-bold text-xl p-3 rounded-lg w-1/2 mx-auto hover:bg-opacity-80 transition disabled:bg-slate-400 disabled:cursor-not-allowed"
            disabled={gameStarted}
          >
            {gameStarted ? (isPause ? pauseTime : elapsedTime) : "Start"}
          </button>
          <button
            onClick={handlePause}
            className="bg-lime-600 text-white font-bold text-xl p-3 rounded-lg w-1/2 mx-auto hover:bg-opacity-80 transition disabled:bg-slate-400 disabled:cursor-not-allowed"
            disabled={!gameStarted}
          >
            {isPause ? "Continue" : "Pause"}
          </button>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleRestore}
            className="bg-lime-600 text-white font-bold text-xl p-3 rounded-lg w-1/2 mx-auto hover:bg-opacity-80 transition disabled:bg-slate-400 disabled:cursor-not-allowed"
            disabled={gameStarted}
          >
            Restore
          </button>
          <button
            className="bg-lime-600 text-white font-bold text-xl p-3 rounded-lg w-1/2 mx-auto hover:bg-opacity-80 transition disabled:bg-slate-400 disabled:cursor-not-allowed"
            disabled={gameStarted}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
