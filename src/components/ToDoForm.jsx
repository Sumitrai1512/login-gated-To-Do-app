import { useState } from "react";
import { toDosApi } from "../api/toDosApi";

export default function ToDoForm({userId, handleCreated}){
    const [title, setTitle] = useState("")
    const [status, setStatus] = useState("idle")
    const [error, setError] = useState(null)

    async function onSubmit(e){
        e.preventDefault()
        if(!title.trim()){
            setError("Title is Empty")
            return
        }

        try{
            setStatus("loading")
            setError(null)
            const created = await toDosApi.create({title, completed: false, userId})
            //pending ui update, done
            handleCreated(created)
            setStatus("success")
            setTitle("")
        } catch(err){
            setStatus("error")
            setError(err.message)
        }
    }

    return (
        <form onSubmit={onSubmit} className="form">
            <h2>Add ToDo</h2>
            <input type="text" placeholder="add a todo" value={title} onChange={(e) => setTitle(e.target.value)}/>
            <div className="form-actions">
                <button disabled={status === "loading"}>Add</button>

            </div>
            {error && <p className="error"> Error: {error}</p>}
        </form>
    )
}