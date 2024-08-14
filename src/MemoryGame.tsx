import { useEffect, useState } from "react";

const arr = [1, 2, 3, 4, 5, 6, 7, 8];

export default function Game() {
  const [array, setArray] = useState(generateArray(arr));
  const [isFlipped, setIsFlipped] = useState(Array(array.length).fill(false));
  const [gameStarted, setGameStarted] = useState(false);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matched, setMatched] = useState(Array(array.length).fill(false));
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  function generateArray(array: number[]) {
    const shuffledArray = [...array, ...array]; // Nhân đôi mảng để có các phần tử trùng lặp
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  }

  const handleStart = () => {
    if (gameStarted) {
      // Nếu trò chơi đã bắt đầu, đặt lại trạng thái
      setIsFlipped(Array(array.length).fill(false));
      setMatched(Array(array.length).fill(false));
      setArray(generateArray(arr));
      setElapsedTime(0);
      setStartTime(null);
    } else {
      // Nếu trò chơi chưa bắt đầu, bắt đầu đồng hồ
      setStartTime(Date.now());
    }
    setGameStarted(!gameStarted);
  };

  const handleClick = (index: number) => {
    if (gameStarted && !isFlipped[index] && flippedIndices.length < 2) {
      // Lật ô nếu trò chơi đã bắt đầu và ô chưa được lật
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
      // Cập nhật thời gian trôi qua mỗi giây
      const timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, startTime]);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      if (array[firstIndex] === array[secondIndex]) {
        // Nếu các ô giống nhau, đánh dấu là đã khớp và đổi màu nền
        setMatched((prev) => {
          const newMatched = [...prev];
          newMatched[firstIndex] = true;
          newMatched[secondIndex] = true;
          return newMatched;
        });
      } else {
        // Nếu các ô không giống nhau, lật lại sau một khoảng thời gian
        setTimeout(() => {
          setIsFlipped((prev) => {
            const newFlipped = [...prev];
            newFlipped[firstIndex] = false;
            newFlipped[secondIndex] = false;
            return newFlipped;
          });
        }, 1000);
      }
      // Xóa chỉ số đã lật
      setFlippedIndices([]);
    }
  }, [flippedIndices, array]);

  useEffect(() => {
    if (matched.every(Boolean)) {
      // Nếu tất cả các ô đã khớp, dừng đồng hồ
      setGameStarted(false);
    }
  }, [matched]);

  return (
    <div className="bg-slate-800 h-screen grid place-content-center">
      {matched.every(Boolean) && (
        <div className="text-white text-xl mt-5">
          Completed in {elapsedTime} seconds!
        </div>
      )}
      <div className="grid grid-cols-4 gap-2 [perspective:1000px]">
        {array.map((a, i) => (
          <div
            key={i}
            className={`relative h-24 w-24 rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d] ${
              isFlipped[i] || matched[i]
                ? "[transform:rotateY(180deg)]"
                : "duration-0"
            }`}
          >
            <div
              className={`absolute inset-0 h-full w-full rounded-lg font-bold flex justify-center items-center text-4xl ${
                matched[i] ? "bg-blue-500 transition " : "bg-orange-500"
              } [backface-visibility:hidden]`}
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
