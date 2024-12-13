import todosCrud from "@/app/lib/crud/todos";

export async function fetch_completed_todos() {
	try {
		if (!syncService.isOnline) {
			return await todosOfflineCrud.getCompletedTodos();
		} else {
			return await todosCrud.getCompletedTodos();
		}

	} catch (error) {
		return {
			returncode: 500,
			message: error.message,
			output: []
		}
	}
}
