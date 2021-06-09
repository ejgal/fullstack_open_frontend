import { useState, useEffect } from 'react'

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || 'https://sleepy-mountain-06375.herokuapp.com'
const WS_URL = process.env.REACT_APP_WS_URL || 'ws://sleepy-mountain-06375.herokuapp.com'
const notes_url = `${API_ENDPOINT}/api/notes`

const socket = new WebSocket(WS_URL)

function App() {
  let [notes, setNotes] = useState([])
  let [content, setContent] = useState("")
  let [error, setError] = useState(null)
  let [num, setNum] = useState(0)

  useEffect(() => {
    console.log("Trying to open socket")
    socket.onopen = () => {
      console.log('Connected')
    }
    socket.onmessage = (e) => {
      console.log("Server message: ", e.data)
      if (e.data === "fetch") {
        setNum(n => n + 1)
      }
    }

    return () => {
      socket.close()
    }
  }, [])

  useEffect(() => {
    fetch(notes_url)
      .then(response => response.json())
      .then(data => setNotes(data))
  }, [num])

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
        // setNotes(notes.concat(data))
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
