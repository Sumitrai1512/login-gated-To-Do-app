import { useEffect, useState } from 'react'
import './App.css'
import LoginForm from './components/LoginForm.jsx'
import ToDoList from './components/ToDoList.jsx'

export default function App() {
  const [user, setUser] = useState(null)

  useEffect(()=>{
    const raw = localStorage.getItem("sessionUser")
    if(raw) {setUser(JSON.parse(raw))}
  }, [])

  function logout(){
    localStorage.removeItem("sessionUser")
    setUser(null)
  }
  return (
  //   <>
  //   <div>
  //     { !user && <LoginForm setUser={setUser}></LoginForm>}
  //     {/* <div>{user.username}</div> */}
  //     { !user && <ToDoList user={user}></ToDoList>}
  //   </div>
  //   </>
  <main className='container'>
    <header className='header'>
      <h1>ToDo List</h1>
      {user && (
        <div className='user-info'>
          <span> Hi, {user.username}</span>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </header>

    {!user ? 
      <LoginForm setUser={setUser}></LoginForm>
    : <ToDoList user={user}></ToDoList>
    }
  </main>
  )
}
  