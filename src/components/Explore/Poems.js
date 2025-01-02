import React from 'react'
import Story from './Story' // Add this line to import the Story component

export default function Poems() {
  return (
    <div>
        <Story id={1} />
        <Story id={2} />
        <Story id={3} />
        <Story id={4} />
        <Story id={5} />
    </div>
  )
}