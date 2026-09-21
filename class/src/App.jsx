import { useState, useEffect, use } from 'react'
import Note from './components/Note'
import noteService from './services/notes'

const App = () => {
  const [notes, setNotes] = useState([])

  const [newNote, setNewNote] = useState(
    'a new note...'
  ) 


  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }


  const hookAccion = () => {
    noteService
      .getAll()
      .then(response => {
        setNotes(response.data)
      })
  }

  useEffect(hookAccion, [])

  const [showAll, setShowAll] = useState(true)
  const notesToShow = showAll ? notes : notes.filter(note => note.important === true)

  const toggleImportanceOf = id => {
  const note = notes.find(n => n.id === id)
  const changedNote = { ...note, important: !note.important }
  noteService
    .update(id, changedNote)
    .then(response =>{
      setNotes(notes.map(note => note.id === id ? response.data : note))
    })
}

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() <0.5,
      id: notes.length + 1,
    }
    noteService
      .create(noteObject)
      .then(response =>{
        setNotes(notes.concat(response.data))
        setNewNote('')
      })
  }
  

  return (
    <div> 
      <h1>Notes</h1>
      <ul>
        {notesToShow.map((note,id) => 
        <Note 
          key={"TESTYTEST"+id} 
          note={note}
          toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>

      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type="submit">save</button>
      </form>   
      <button onClick={() => setShowAll(!showAll)}> {showAll ? "Filter" : "Show All"}</button>
    </div>
  )
}

export default App