import { useState, useEffect } from 'react'

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || 'https://sleepy-mountain-06375.herokuapp.com'
const notes_url = `${API_ENDPOINT}/api/notes`

function App() {
  let [notes, setNotes] = useState([])
  let [content, setContent] = useState("")
  let [error, setError] = useState(null)

  useEffect(() => {
    fetch(notes_url)
      .then(response => response.json())
      .then(data => setNotes(data))
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    const note = {
      content: content,
    }
    fetch(notes_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data)
        setNotes(notes.concat(data))
        setContent('')
      })
      .catch((error) => {
        console.log('Error: ', error)
        setError('Could not store note.')
      })
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type your note here"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {error ? <p>{error}</p> : null}

        <button type="submit" disabled={content.length === 0} >Add note</button>
      </form>
      <h2>Notes</h2>
      {notes.map((note) => {
        return <p key={note.id}>{note.content}</p>
      })}
    </div>
  );
}

export default App;
