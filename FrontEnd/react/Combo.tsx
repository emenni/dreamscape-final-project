import React from 'react'

export const Combo = ({ combos }) => {

  return (
    <div>
      <p>{`O combo ${combos.combinationId} composto pelos IDs: ${combos.combination}, foi vendido ${combos.occurrences} vezes`}</p>
    </div>
  )
}
