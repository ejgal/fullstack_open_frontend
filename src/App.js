import { useState, useEffect } from 'react'
import './app.css'


const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || 'https://sleepy-mountain-06375.herokuapp.com'
const WS_URL = process.env.REACT_APP_WS_URL || 'wss://sleepy-mountain-06375.herokuapp.com'
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
      .then(data => setNotes(data.reverse()))
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
      <h1>Realtime notes</h1>
      <form className="note-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type your note here"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {error ? <p>{error}</p> : null}

        <button className="submit-button" type="submit" disabled={content.length === 0} >Add note</button>
      </form>
      <div className="notes">
        {notes.map((note) => {
          const date = new Date(note.date)
          const dateString = date.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })
          return (
            <>
              <p className="note" key={note.id}>
                <span className="date">{dateString} - </span>{note.content}
              </p>
            </>)
        })}
      </div>
    </div >
  );
}

export default App;
