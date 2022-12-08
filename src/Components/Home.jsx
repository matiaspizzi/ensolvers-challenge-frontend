import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Note from './Note'
import axios from 'axios'
import ModalForm from './ModalFormNote'
import Select from './Select'

const Home = () => {

  const [notes, setNotes] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showFormModal, setShowFormModal] = useState(false)
  const [printedNotes, setPrintedNotes] = useState([])

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/notes/`)
      .then(res => {
        if (res.status !== 200) {
          throw Error('Could not fetch the notes for that resource')
        }
        const notes = res.data
        setNotes(notes)
        setPrintedNotes(notes)
        setIsLoading(false)
        setError(null)
        return notes
      })
      .catch(err => {
        setIsLoading(false)
        setError(err.message)
      })
  }, [])

  const addNote = (note) => {
    setNotes([...notes, note])
    setPrintedNotes([...printedNotes, note])
  }

  const removeNote = (id) => {
    setNotes(notes.filter(note => note.id !== id))
    unprintNote(id)
  }

  const updateNote = (updatedNote) => {
    const updatedNotes = notes.map(note => note.id === updatedNote.id ? updatedNote : note)
    setNotes(updatedNotes)
  }

  const handleSelect = (value) => {
    if (value === 'All') {
      setPrintedNotes(notes)
    } else {
      const filteredNotes = []
      notes.forEach(note => {
        note.tags.forEach(tag => {
          if (tag.name === value && !filteredNotes.includes(note) && note.archived === 0) {
            filteredNotes.push(note)
          }
        })
      })
      setPrintedNotes(filteredNotes)
    }
  }

  const unprintNote = (id) => {
    setPrintedNotes(printedNotes.filter(note => note.id !== id))
  }

  return (
    <>
      <div className='flex flex-row w-full h-24 px-10 py-5 items-center gap-4'>
        <h1 className='flex justify-self-start font-medium text-4xl'>My Notes</h1>
        <button onClick={() => { setShowFormModal(true) }} className='bg-slate-200 px-2 p-1 border border-slate-900 text-xs'>Create Note</button>
        <Link to="/archived" className='underline text-blue-600'>Archived notes</Link>
      </div>
      <div className='flex flex-row gap-2 px-10 pb-5'>
        <p>Category filter </p>
        <Select notes={notes} handleSelect={handleSelect} />
      </div>
      <div className='grid xl:grid-cols-3 md:grid-cols-2  gap-10 w-full justify-items-center'>
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {!isLoading && printedNotes?.length === 0 && <p>No notes found</p>}
        {printedNotes && printedNotes.map(note => (
          note.archived === 0 && <Note key={note.id} note={note} removeNote={removeNote} unprintNote={unprintNote} updateNote={updateNote} />
        ))}
      </div>
      {showFormModal && <ModalForm setShowFormModal={setShowFormModal} addNote={addNote} notes={notes} />}
    </>
  )
}

export default Home
