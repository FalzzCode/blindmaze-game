import { LOCAL_SCORE_KEY } from './constants.js'

export function readLocalScores() {
  try {
    const savedScores = JSON.parse(localStorage.getItem(LOCAL_SCORE_KEY) || '[]')
    return Array.isArray(savedScores) ? savedScores : []
  } catch {
    return []
  }
}

export function sortScores(scores) {
  return [...scores]
    .sort((firstScore, secondScore) => (
      secondScore.score - firstScore.score || secondScore.stage - firstScore.stage
    ))
    .slice(0, 10)
}

export function formatScore(score) {
  return Number(score || 0).toLocaleString('id-ID')
}

export function getPhaseLabel(phase) {
  return phase === 'memorize' ? 'MEMORIZE' : 'MOVE TIME'
}

