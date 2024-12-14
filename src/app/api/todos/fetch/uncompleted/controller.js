import todosCrud from "@/app/lib/crud/todos";

export async function fetch_uncompleted_todos() {
	try {
		return await todosCrud.getUncompletedTodos();
		// if (!syncService.isOnline) {
		// 	return await todosOfflineCrud.getUncompletedTodos();
		// } else {
		// 	return await todosCrud.getUncompletedTodos();
		// }
	} catch (error) {
		return {
			returncode: 500,
			message: error.message,
			output: []
		}
	}
}
