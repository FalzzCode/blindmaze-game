import { useCallback, useEffect, useRef, useState } from 'react'
import api from './lib/api.js'
import {
  GAME_PHASES,
  GAME_SCREENS,
  GRID_SIZE,
  LOCAL_SCORE_KEY,
  MEMORIZE_SECONDS,
  MODALS,
  MOVE_SECONDS,
  STARTING_LIVES,
} from './game/constants.js'
import { createRandomMaze, getCellKey } from './game/maze.js'
import { readLocalScores, sortScores } from './game/scores.js'
import GameScreen from './components/game/GameScreen.jsx'
import {
  GameNoticeModal,
  GameOverModal,
  InstructionsModal,
  LeaderboardModal,
} from './components/game/GameModals.jsx'
import MenuScreen from './components/game/MenuScreen.jsx'

function App() {
  const [currentScreen, setCurrentScreen] = useState(GAME_SCREENS.MENU)
  const [username, setUsername] = useState('')

  const [stage, setStage] = useState(1)
  const [lives, setLives] = useState(STARTING_LIVES)
  const [score, setScore] = useState(0)
  const [maze, setMaze] = useState(null)
  const [player, setPlayer] = useState(null)
  const [phase, setPhase] = useState(GAME_PHASES.MEMORIZE)
  const [timeLeft, setTimeLeft] = useState(MEMORIZE_SECONDS)

  const [hintUsed, setHintUsed] = useState(false)
  const [hintVisible, setHintVisible] = useState(false)
  const [notice, setNotice] = useState(null)
  const [gameOver, setGameOver] = useState(null)

  const [openModal, setOpenModal] = useState(null)
  const [leaderboard, setLeaderboard] = useState(() => sortScores(readLocalScores()))
  const [leaderboardLoading, setLeaderboardLoading] = useState(false)
  const [savingScore, setSavingScore] = useState(false)
  const [scoreSaved, setScoreSaved] = useState(false)

  const hintTimerRef = useRef(null)

  const refreshLeaderboard = useCallback(async () => {
    try {
      const response = await api.get('/highscores')
      const serverScores = response.data?.data?.scores || []
      const scoresToShow = serverScores.length ? serverScores : readLocalScores()
      setLeaderboard(sortScores(scoresToShow))
    } catch {
      setLeaderboard(sortScores(readLocalScores()))
    } finally {
      setLeaderboardLoading(false)
    }
  }, [])

  const openLeaderboard = useCallback(() => {
    setLeaderboardLoading(true)
    setOpenModal(MODALS.LEADERBOARD)
    refreshLeaderboard()
  }, [refreshLeaderboard])

  const openInstructions = useCallback(() => {
    setOpenModal(MODALS.INSTRUCTIONS)
  }, [])

  const closeModal = useCallback(() => {
    setOpenModal(null)
  }, [])

  useEffect(() => {
    return () => {
      if (hintTimerRef.current) {
        window.clearTimeout(hintTimerRef.current)
      }
    }
  }, [])

  function startStage(nextStage, nextLives, nextScore) {
    const nextMaze = createRandomMaze()

    setStage(nextStage)
    setLives(nextLives)
    setScore(nextScore)
    setMaze(nextMaze)
    setPlayer(nextMaze.start)
    setPhase(GAME_PHASES.MEMORIZE)
    setTimeLeft(MEMORIZE_SECONDS)
    setHintUsed(false)
    setHintVisible(false)
  }

  function startGame(event) {
    event.preventDefault()

    const trimmedUsername = username.trim()
    if (!trimmedUsername) return

    setUsername(trimmedUsername)
    setGameOver(null)
    setNotice(null)
    setScoreSaved(false)
    setCurrentScreen(GAME_SCREENS.GAME)
    startStage(1, STARTING_LIVES, 0)
  }

  function returnToMenu() {
    setCurrentScreen(GAME_SCREENS.MENU)
    setGameOver(null)
    setMaze(null)
    setPlayer(null)
    setNotice(null)
    setOpenModal(null)
  }

  const handleLifeLost = useCallback((reason, title) => {
    const nextLives = lives - 1

    setHintVisible(false)
    setNotice({
      type: 'danger',
      eyebrow: nextLives <= 0 ? 'GAME OVER' : 'STAGE WARNING',
      title: nextLives <= 0 ? 'HP kamu habis' : title,
      message: reason,
      detail: nextLives <= 0 ? 'Perjalananmu berakhir di stage ini.' : 'Maze baru akan dibuat saat kamu mengulang stage.',
      actionLabel: nextLives <= 0 ? 'Lihat hasil' : 'Ulangi stage',
      nextLives,
    })
  }, [lives])

  const finishStage = useCallback(() => {
    const stageScore = stage * 100 + timeLeft * 5 + lives * 10
    const nextScore = score + stageScore

    setNotice({
      type: 'success',
      eyebrow: 'STAGE CLEAR',
      title: `Stage ${stage} selesai`,
      message: `Rute ditemukan! Kamu mendapat +${stageScore} poin.`,
      detail: `Stage ${stage + 1} akan memakai maze baru dengan waktu memorize 10 detik.`,
      actionLabel: `Lanjut ke stage ${stage + 1}`,
      nextStage: stage + 1,
      nextLives: lives,
      nextScore,
    })
  }, [lives, score, stage, timeLeft])

  function continueNotice() {
    if (!notice) return

    const currentNotice = notice
    setNotice(null)

    if (currentNotice.type === 'success') {
      startStage(currentNotice.nextStage, currentNotice.nextLives, currentNotice.nextScore)
      return
    }

    if (currentNotice.nextLives <= 0) {
      setLives(0)
      setPhase(GAME_PHASES.GAME_OVER)
      setGameOver({ stage, score })
      return
    }

    startStage(stage, currentNotice.nextLives, score)
  }

  const movePlayer = useCallback((rowDelta, columnDelta) => {
    if (!maze || !player || phase !== GAME_PHASES.MOVE || gameOver || notice) return

    const nextPosition = {
      row: player.row + rowDelta,
      column: player.column + columnDelta,
    }

    const isOutsideBoard = (
      nextPosition.row < 0
      || nextPosition.row >= GRID_SIZE
      || nextPosition.column < 0
      || nextPosition.column >= GRID_SIZE
    )
    if (isOutsideBoard) return

    if (maze.walls.includes(getCellKey(nextPosition.row, nextPosition.column))) {
      handleLifeLost('Kamu menabrak dinding. HP berkurang dan stage akan diulang.', 'Kena dinding')
      return
    }

    const reachedFinish = (
      nextPosition.row === maze.finish.row
      && nextPosition.column === maze.finish.column
    )
    if (reachedFinish) {
      finishStage()
      return
    }

    setPlayer(nextPosition)
  }, [finishStage, gameOver, handleLifeLost, maze, notice, phase, player])

  useEffect(() => {
    const isGameRunning = currentScreen === GAME_SCREENS.GAME
    const isTimedPhase = [GAME_PHASES.MEMORIZE, GAME_PHASES.MOVE].includes(phase)

    if (!isGameRunning || !maze || notice || !isTimedPhase) return undefined

    const timer = window.setTimeout(() => {
      if (timeLeft > 1) {
        setTimeLeft(timeLeft - 1)
        return
      }

      if (phase === GAME_PHASES.MEMORIZE) {
        setPhase(GAME_PHASES.MOVE)
        setTimeLeft(MOVE_SECONDS)
      } else {
        handleLifeLost('Waktu habis. HP berkurang dan stage akan diulang.', 'Waktu habis')
      }
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [currentScreen, handleLifeLost, maze, notice, phase, timeLeft])

  useEffect(() => {
    const isMoving = phase === GAME_PHASES.MOVE
    if (currentScreen !== GAME_SCREENS.GAME || !isMoving || gameOver || notice) return undefined

    function handleKeyDown(event) {
      const movesByKey = {
        ArrowUp: [-1, 0],
        ArrowDown: [1, 0],
        ArrowLeft: [0, -1],
        ArrowRight: [0, 1],
        w: [-1, 0],
        s: [1, 0],
        a: [0, -1],
        d: [0, 1],
      }

      const movement = movesByKey[event.key]
      if (!movement) return

      event.preventDefault()
      movePlayer(movement[0], movement[1])
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentScreen, gameOver, movePlayer, notice, phase])

  function useHint() {
    const canUseHint = phase === GAME_PHASES.MOVE && !hintUsed
    if (!canUseHint) return

    setHintUsed(true)
    setHintVisible(true)

    if (hintTimerRef.current) {
      window.clearTimeout(hintTimerRef.current)
    }

    hintTimerRef.current = window.setTimeout(() => setHintVisible(false), 1000)
  }

  async function saveScore() {
    if (!gameOver || savingScore || scoreSaved) return

    const scoreEntry = {
      username: username.trim(),
      stage: gameOver.stage,
      score: gameOver.score,
    }

    setSavingScore(true)

    try {
      await api.post('/highscores', scoreEntry)
    } catch {
      const localScores = sortScores([scoreEntry, ...readLocalScores()])
      localStorage.setItem(LOCAL_SCORE_KEY, JSON.stringify(localScores))
    }

    setLeaderboardLoading(true)
    await refreshLeaderboard()
    setSavingScore(false)
    setScoreSaved(true)
  }

  if (currentScreen === GAME_SCREENS.MENU) {
    return (
      <div className="min-h-screen bg-[#07101f] text-slate-100">
        <MenuScreen
          username={username}
          setUsername={setUsername}
          onStart={startGame}
          onInstructions={openInstructions}
          onLeaderboard={openLeaderboard}
        />
        {openModal === MODALS.INSTRUCTIONS && <InstructionsModal onClose={closeModal} />}
        {openModal === MODALS.LEADERBOARD && <LeaderboardModal scores={leaderboard} loading={leaderboardLoading} onClose={closeModal} />}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#07101f] text-slate-100">
      <GameScreen
        username={username}
        stage={stage}
        lives={lives}
        score={score}
        maze={maze}
        player={player}
        phase={phase}
        timeLeft={timeLeft}
        hintUsed={hintUsed}
        hintVisible={hintVisible}
        onMove={movePlayer}
        onHint={useHint}
        onQuit={returnToMenu}
        onInstructions={openInstructions}
      />
      {openModal === MODALS.INSTRUCTIONS && <InstructionsModal onClose={closeModal} />}
      {notice && <GameNoticeModal notice={notice} onContinue={continueNotice} />}
      {gameOver && (
        <GameOverModal
          username={username}
          stage={gameOver.stage}
          score={gameOver.score}
          saving={savingScore}
          saved={scoreSaved}
          onSave={saveScore}
          onMenu={returnToMenu}
          onLeaderboard={openLeaderboard}
        />
      )}
      {openModal === MODALS.LEADERBOARD && <LeaderboardModal scores={leaderboard} loading={leaderboardLoading} onClose={closeModal} />}
    </div>
  )
}

export default App

