import { useState, useEffect } from 'react'
import Note from './Note'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Archived = () => {

  const [notes, setNotes] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/notes/archived`)
      .then(res => {
        if (res.status !== 200) {
          throw Error('Could not fetch the data for that resource')
        }
        return res.data
      })
      .then(data => {
        setNotes(data)
        setIsLoading(false)
        setError(null)
      })
      .catch(err => {
        setIsLoading(false)
        setError(err.message)
      })
  }, [])

  const updateNote = (updatedNote) => {
    const updatedNotes = notes.map(note => note.id === updatedNote.id ? updatedNote : note)
    setNotes(updatedNotes)
  }

  const removeNote = (id) => {
    setNotes(notes.filter(note => note.id !== id))
  }

  return (
    <>
      <div className='flex flex-row w-full h-32 p-10 items-center gap-4'>
        <h1 className='flex justify-self-start font-medium text-4xl'>Archived Notes</h1>
        <Link to="/" className='underline text-blue-600'> &lt; Go back to unarchived notes</Link>
      </div>
      <div className='grid xl:grid-cols-3 md:grid-cols-2  gap-10 w-full justify-items-center'>
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {!isLoading && notes?.length === 0 && <p>No notes found</p>}
        {notes && notes.map(note => (
          note.archived === 1 && <Note key={note.id} note={note} removeNote={removeNote} updateNote={updateNote} />
        ))}
      </div>
    </>
  )
}

export default Archived