// CSS
import './App.css';

// React
import { useCallback, useEffect, useState } from 'react';

// Data
import { wordsList } from './data/word'

// Components
import StartScreen from './components/StartScreen/StartScreen';
import Game from './components/Game/Game';
import GameOver from './components/GameOver/GameOver';

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
]

const guessesQtd = 3

function App() {
  const [gameStage, setGameStage]  = useState(stages[0].name)
  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState('')
  const [pickedCategory, setpickedCategory] = useState('')
  const [letters, setLetters] = useState([])

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(3)
  const [score, setScore] = useState(0)


  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * categories.length)]
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    return { word, category }
  }, [words])
  
  const startGame = useCallback(() => {
    clearLetterStates()

    const { word, category } = pickWordAndCategory()

    let wordLetters = word.split("")

    wordLetters = wordLetters.map((letra) => letra.toLowerCase())
    console.log(wordLetters)

    setPickedWord(word)
    setpickedCategory(category)
    setLetters(wordLetters)

    setGameStage(stages[1].name)
  }, [pickWordAndCategory])

  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase()

    //checar se uma letra já foi utilizada
    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)){
      return;
    }

    if(letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters, //pega todos os elementos do array
        letter, //adiciona uma nova letra ao array
      ])
    }else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ])

      setGuesses((actualGuesses) => actualGuesses - 1)
    }

  }

   // resseta o jogo
   const retry = () => {
    setScore(0)
    setGuesses(3)
    setGameStage(stages[0].name)
  }

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  //monitora algum dado, tem uma função que será executada a cada vez que o dado for alterado, 
  //como segundo argumento recebe o dado que deseja monitorar entre []
  useEffect(() => {
    if(guesses === 0) {
      //resetar todos os states
      clearLetterStates()
      setGameStage(stages[2].name)
    }
  }, [guesses]) 

  useEffect(() => {
    const uniqueLetters = [...new Set(letters)] // set remove itens repetidos

    if(guessedLetters.length === uniqueLetters.length){
      setScore((actualScore) => actualScore += 100)
      startGame()
    }
  }, [guessedLetters, letters, startGame])

 

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame}></StartScreen>}
      {gameStage === 'game' && <Game 
      verifyLetter={verifyLetter} 
      pickedWord={pickedWord} 
      pickedCategory={pickedCategory} 
      guessedLetters={guessedLetters}
      wrongLetters={wrongLetters}
      guesses={guesses}
      score={score}
      letters={letters}>
      </Game>}
      {gameStage === 'end' && <GameOver retry={retry} score={score}></GameOver>}
    </div>
  );
}

export default App;
