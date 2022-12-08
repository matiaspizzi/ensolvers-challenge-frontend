import { useState, useEffect } from 'react'

const Select = (props) => {

  const [usedTags, setUsedTags] = useState([])

  useEffect(() => {
    const usedTags = []
    if (props.notes?.length > 0) {
      props.notes.forEach(note => {
        if (note.archived === 0) {
          note.tags?.forEach(tag => {
            if (!usedTags.some(usedTag => usedTag.name === tag.name)) {
              usedTags.push(tag)
            }
          })
        }
      })
    }
    setUsedTags(usedTags)
  }, [props.notes])

  return (
    <select onChange={((e) => { props.handleSelect(e.target.value) })} className='border border-slate-600 px-2 focus:border-1 focus:border-blue-500'>
      <option value="All">All</option>
      {usedTags && usedTags.map(tag => (
        <option key={tag.name} value={tag.name}>{tag.name}</option>
      ))}
    </select>
  )
}

export default Select