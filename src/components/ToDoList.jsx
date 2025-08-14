import { useEffect, useState } from "react";
import { toDosApi } from "../api/toDosApi.js";
import ToDoForm from "./ToDoForm.jsx";

export default function ToDoList({ user }) {
    const [todos, setTodos] = useState([]);
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const limit = 5;
   

    useEffect(() => {
        async function load() {
            try {
                setStatus("loading");
                setError(null);
                const data = await toDosApi.list({ userId: user.id, _page: page, _limit: limit });
                setTodos(data);
                setStatus("success");
            } catch (err) {
                setStatus("error");
                setError(err.message);
            }
        }
        load();
    }, [user.id, page]);

    function handleCreated(newTodo) {
        setTodos(prev => [...prev, newTodo]);
    }

    async function handleDelete(id) {
        const ok = confirm("Delete this todo?");
        if (!ok) return;
        const prev = todos;
        setTodos(prev.filter(t => t.id !== id));

        try {
            await toDosApi.remove(id);
        } catch (err) {
            alert("Delete failed " + err.message);
            setTodos(prev);
        }
    }

    async function handleToggle(todo) {
        const updated = { ...todo, completed: !todo.completed };
        setTodos(prev => prev.map(t => t.id === todo.id ? updated : t));

        try {
            await toDosApi.update(todo.id, { completed: updated.completed });
        } catch (err) {
            alert("Toggle failed " + err.message);
            setTodos(prev => prev.map(t => t.id === todo.id ? todo : t)); // revert
        }
    }

    return (
        <section>
            <ToDoForm userId={user.id} handleCreated={handleCreated} />

            <div className="pagination">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
                {Array.from({ length: 3 }, (_, i) => (
                    <button key={i + 1} onClick={() => setPage(i + 1)} className={page === i + 1 ? "active" : ""}> {i + 1} </button>
                ))}
                <button disabled={page === 3} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>

            {status === "loading" && <p className="status">Loading ToDos..</p>}
            {status === "error" && <p className="status">Error: {error}</p>}
            {status === "success" && todos.length === 0 && <p>No Todos Yet</p>}

            {status === "success" && todos.length > 0 && (
                <ul className="todo-list">
                    {todos.map(t => (
                        <li key={t.id} className="todo-item">
                            <label className="todo-label">
                                <input
                                    type="checkbox"
                                    checked={t.completed}
                                    onChange={() => handleToggle(t)}
                                />
                                <span className={t.completed ? "completed" : ""}>{t.title}</span>
                            </label>
                            <button className="delete-btn" onClick={() => handleDelete(t.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
