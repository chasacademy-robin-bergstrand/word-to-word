import { useState, useEffect } from "react";

const randomWordApi = "https://random-word-api.herokuapp.com/word";
const trgApi = "https://api.datamuse.com/words?rel_trg=";
const relApi = "https://api.datamuse.com/words?ml=";
const synApi = "https://api.datamuse.com/words?rel_syn=";

function App() {
    const [startWord, setStartWord] = useState("");
    const [endWord, setEndWord] = useState("");
    const [synonymList, setSynonymList] = useState([]);
    const [wordHistory, setWordHistory] = useState([]);

    useEffect(() => {
        getRandomStartWord();
        getRandomEndWord();
    }, []);

    async function getRandomStartWord() {
        const response = await fetch(randomWordApi);
        const data = await response.json();
        setStartWord(data[0]);
        /* const response2 = await fetch(synonymApi + data[0]);
        const data2 = await response2.json();
        setSynonymList(data2); */
        getSynonymList(data[0]);
    }
    async function getRandomEndWord() {
        const response = await fetch(randomWordApi);
        const data = await response.json();
        setEndWord(data[0]);
    }
    async function getSynonymList(word, undoAction = false) {
        const response = await fetch(relApi + word);
        const data = await response.json();
        if (!data[0]) {
            getRandomStartWord();
            return;
        }
        setSynonymList(data);
        console.log(undoAction);
        if (!undoAction) {
            const newWordHistory = [...wordHistory];
            newWordHistory.push(word);
            setWordHistory(newWordHistory);
        }
    }
    function handleWordClicked(word) {
        getSynonymList(word);
        /* const newWordHistory = [...wordHistory];
        newWordHistory.push(word);
        setWordHistory(newWordHistory); */
    }
    function undoMove() {
        const newWordHistory = [...wordHistory];
        newWordHistory.pop();
        setWordHistory(newWordHistory);
        getSynonymList(wordHistory[wordHistory.length - 2], true);
    }

    return (
        <div className="bg-gray-800 text-gray-200 min-h-screen">
            <header className="h-20 bg-gray-700 flex row items-center px-10">
                <h1 className="text-3xl uppercase">
                    <span className="text-orange-700 font-bold">Word</span>
                    ToWord
                </h1>
            </header>
            {synonymList[0] ? (
                <main className="w-96 mx-auto text-center pt-10">
                    <div>
                        <button
                            className="mb-6 border px-2 py-1 rounded"
                            onClick={undoMove}
                        >
                            {"Undo"}
                        </button>
                    </div>
                    {
                        <h1 className="text-4xl mb-10">
                            {startWord} to {endWord}
                        </h1>
                    }
                    <ul className="flex row gap-2 justify-center mb-10 max-w-5xl flex-wrap">
                        <li>Your path:</li>
                        {wordHistory.map((word) => (
                            <li>{word}</li>
                        ))}
                    </ul>
                    <ul>
                        {synonymList.map((synonym) => (
                            <li
                                className="py-1 px-2 hover:outline cursor-pointer"
                                onClick={() => handleWordClicked(synonym.word)}
                            >
                                {synonym.word}
                            </li>
                        ))}
                    </ul>
                </main>
            ) : (
                <h2>Preparing game..</h2>
            )}
        </div>
    );
}

export default App;
