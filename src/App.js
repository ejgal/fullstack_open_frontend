import { useState, useEffect } from 'react'

function App() {
  let [notes, setNotes] = useState([])

  useEffect(() => {
    fetch('https://sleepy-mountain-06375.herokuapp.com/api/notes')
      .then(response => response.json())
      .then(data => setNotes(data))
  }, [])

  return (
    <div className="App">
      {notes.map((note) => {
        return <p key={note.id}>{note.content}</p>
      })}
    </div>
  );
}

export default App;
