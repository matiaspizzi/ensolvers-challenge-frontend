import axios from 'axios'
import imgNote from '../assets/media/note.png'
import imgArchive from '../assets/media/archive.png'
import imgUnarchive from '../assets/media/unarchive.png'
import imgDelete from '../assets/media/delete.png'
import imgEdit from '../assets/media/edit.png'
import ModalDelete from './ModalDeleteNote'
import ModalForm from './ModalFormNote'
import ModalNote from './ModalNote'
import { useState } from 'react'

const Note = (props) => {

  const API_URL = process.env.REACT_APP_API_URL

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [showNoteModal, setShowNoteModal] = useState(false)

  const archiveNote = async () => {
    await axios.put(`${API_URL}/api/notes/${props.note.id}/archive`)
      .then(_res => {
        props.updateNote({ ...props.note, archived: !props.note.archived })
        props.unprintNote?.(props.note.id)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const deleteNote = async () => {
    await axios.delete(`${API_URL}/api/notes/${props.note.id}`)
      .then(_res => {
        props.removeNote(props.note.id)
        setShowDeleteModal(false)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const arcImg = props.note.archived ? imgUnarchive : imgArchive;
  const arcAlt = props.note.archived ? 'Unarchive note' : 'Archive note';

  return (
    <div className='flex flex-row w-3/4 max-w-[460px] border border-slate-800 hover:border p-2 gap-2'>
      <img src={imgNote} alt="" className='w-[55 px] h-[55px]' />
      <div onClick={() => { setShowNoteModal(true) }} className='flex flex-col hover:text-blue-500 mr-auto w-full h-full cursor-pointer'>
        <h1 className='font-medium text-2xl'>{props.note.title}</h1>
        <p className='text-sm'>Last edited: {props.note.updated_at}</p>
      </div>
      <div className='flex flex-row items-end justify-items-end gap-1 min-w-[80px]'>
        <button onClick={archiveNote}>
          <img src={arcImg} alt={arcAlt} className='w-[23px] h-[23px]' />
        </button>
        <button onClick={() => { setShowFormModal(true) }}>
          <img src={imgEdit} alt="Edit note" className='w-[23px] h-[23px]' />
        </button>
        <button onClick={() => { setShowDeleteModal(true) }}>
          <img src={imgDelete} alt="Delete note" className='w-[23px] h-[23px]' />
        </button>
      </div>
      {showNoteModal && <ModalNote note={props.note} setShowNoteModal={setShowNoteModal} />}
      {showFormModal && <ModalForm note={props.note} setShowFormModal={setShowFormModal} updateNote={props.updateNote} />}
      {showDeleteModal && <ModalDelete note={props.note} deleteNote={deleteNote} setShowDeleteModal={setShowDeleteModal} />}
    </div>
  )
}

export default Note
