import './GameOver.css'

const GameOver = ({retry, score}) => {
  return (
    <div>
        <h1>Fim do Jogo</h1>
        <h2>Sua pontuação foi: {score}</h2>
        <button onClick={retry}>Jogar novamente</button>
    </div>
  )
}

export default GameOver