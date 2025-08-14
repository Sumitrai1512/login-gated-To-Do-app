import { useState } from "react";
import { authApi } from "../api/authApi";


export default function LoginForm({setUser}){
    const [form, setForm] = useState({username:"", password: ""})
    const [status, setStatus] = useState("idle")
    const [error, setError] = useState(null)

    function onChange(e){
        const {name, value} = e.target
        setForm(prev => ({...prev, [name]: value}))
    }

    async function onSubmit(e){
        e.preventDefault()
        try{
            setStatus("loading")
            setError(null)
            const user = await authApi.login(form)
            localStorage.setItem("sessionUser", JSON.stringify(user)) //method to store data using local storage
            setStatus("idle")
            setUser(user)

        } catch(err){
            setStatus("idle")
            setError(err.message)

        }
    }

    return (
        <form className="form" onSubmit={onSubmit}>
            <h2>Login</h2>
            <input type="text" placeholder="username" name="username" value={form.user} onChange={onChange} />
            <input type="password" placeholder="password" name="password" value={form.password} onChange={onChange} />
            <div className="form-actions">
                <button disabled={status==="loading"}>Login</button>
                {status && <span className="status">loading... </span>}
            </div>
            {error && <p className="error">Error: {error}</p>}
        </form>
    )
}