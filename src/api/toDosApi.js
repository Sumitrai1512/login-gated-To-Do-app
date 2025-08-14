import {http} from "./http.js"

export const toDosApi = {
    async list({userId, _page=1, _limit=10, _sort="id", _order="desc"}){
        const params = {userId, _page, _limit, _sort, _order}
        const res = await http.get("/todos", {params})
        return res.data
    },

    async create(todo){
        const res = await http.post("/todos", todo, {
            headers : {"Content-Type": "application/json"}
        })
        return res.data
    },

    async remove(id){
        await http.delete(`/todos/${id}`)
        return true
    },

    //toggle logic
    async update(id, changes) {
    const res = await http.patch(`/todos/${id}`, changes, {
        headers: { "Content-Type": "application/json" }
    });
    return res.data;
}

}