import { useState, useEffect } from 'react'
import axios from 'axios'
import imgRemove from '../assets/media/remove.png'
import imgTag from '../assets/media/tag.png'

const ModalCreateNote = (props) => {

  const [title, setTitle] = useState(props.note?.title || '')
  const [content, setContent] = useState(props.note?.content || '')
  const [inputTag, setInputTag] = useState('')
  const [tags, setTags] = useState(props.note?.tags || [])

  const API_URL = process.env.REACT_APP_API_URL

  useEffect(() => {
    axios.get(`${API_URL}/api/notes/${props.note?.id}`)
      .then(res => {
        setTags(res.data.tags)
      })
      .catch(err => {
        console.log(err)
      })
  }, [API_URL, props.note?.id])


  const createNote = async () => {
    await axios.post(`${API_URL}/api/notes`, { title, content })
      .then(res => {
        props.addNote({ ...res.data, archived: 0, tags })
        props.setShowFormModal(false)
        postTags(res.data.id)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const editNote = async () => {
    await axios.put(`${API_URL}/api/notes/${props.note.id}`, { title, content, tags })
      .then(res => {
        props.updateNote({ ...res.data, tags })
        props.note.tags = tags
        props.note.title = title
        props.note.content = content
        props.setShowFormModal(false)
      })
      .catch(err => {
        console.log(err)
      })
    await postTags(props.note.id)
  }

  const postTags = async (id) => {
    await axios.delete(`${API_URL}/api/notes/${id}/removetags`)
    await tags?.forEach(async tag => {
      await axios.post(`${API_URL}/api/tags`, { name: tag.name })
        .then(res => {
          axios.post(`${API_URL}/api/notes/${id}/addtag`, { id: res.data.id })
          setTags([...tags, res.data])
        })
    })
  }

  const addTag = async () => {
    if (inputTag === '') return
    const str = inputTag.replace(/ /g, "-");
    if (tags?.find(tag => tag.name === str)) return
    setTags(tags?.concat({ name: str }) || [{ name: str }])
  }

  const removeTag = async (tag) => {
    setTags(tags.filter(t => t.name !== tag.name))
  }

  return (
    <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex flex-col self-center justify-self-center min-w-[100%]">
                <div className="mt-3 text-center sm:mt-0 sm:text-left min-w-[90%]">
                  <h2 className="text-xl font-medium leading-6 text-gray-900 min-w-[100%] pl-4" id="modal-title">Create/Edit Note</h2>
                  <div className='flex flex-col p-4 gap-2 min-w-[100%] items-center justify-items-center'>
                    <div className='flex flex-col self-center justify-self-center min-w-[300px]'>
                      <p className='flex'>Title: </p>
                      <input onChange={(e) => { setTitle(e.target.value) }} placeholder="Title" type="text" defaultValue={props.note ? props.note.title : null} className="border p-1 border-slate-600 w-full" />
                    </div>
                    <div className='flex flex-col self-center justify-self-center min-w-[300px]'>
                      <p className='flex'>Content: </p>
                      <textarea onChange={(e) => { setContent(e.target.value) }} placeholder="Content" type="text" defaultValue={props.note ? props.note.content : null} className="border p-1 border-slate-600 w-full min-h-[100px]" />
                    </div>
                    <div>
                      <p className='flex'>Tags: </p>
                      <div className='flex flex-wrap gap-2 border border-slate-600 min-h-[70px] min-w-[300px] p-2'>
                        {tags?.map((tag) => {
                          return (
                            <div key={tag.name} className='flex flex-row gap-1 items-center justify-items-center border border-slate-500 max-h-[25px] px-1 text-sm'>
                              <img src={imgTag} alt="tag" className='w-5' />
                              <p className='flex'>{tag.name}</p>
                              <button onClick={() => { removeTag(tag) }} className="w-5"><img src={imgRemove} alt="remove" /></button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    <div className='flex flex-row w-[300px]'>
                      <input type="text" onChange={(e) => { setInputTag(e.target.value) }} className='border border-slate-600 min-w-[80%] px-2' />
                      <button onClick={() => { addTag(inputTag) }} className="bg-slate-300 hover:bg-slate-200 border border-slate-600 px-2 min-w-[20%]">Add</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button onClick={props.note ? editNote : createNote} className="inline-flex w-full justify-center border border-transparent bg-red-400 px-4 py-1 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm">Save</button>
              <button onClick={() => { props.setShowFormModal(false) }} className="mt-3 inline-flex w-full justify-center border border-gray-300 bg-white px-4 py-1 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalCreateNote