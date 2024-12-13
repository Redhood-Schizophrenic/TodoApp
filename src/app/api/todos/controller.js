import todosCrud from "@/app/lib/crud/todos";
import todosOfflineCrud from "@/app/lib/offline_crud/todos";
import syncService from "@/app/lib/services/syncService";

export async function createTodo(data) {
	try {
		// Params
		const title = data['title'] || null;
		const description = data['description'] || null;

		if (title === null || description === null) {
			return {
				returncode: 400,
				message: "Missing Required Params",
				output: []
			}
		}

		if (!syncService.isOnline) {
			const result = await todosOfflineCrud.createTodo({ title, description });
			return result;
		} else {
			const result = await todosCrud.createTodo({ title, description });
			return result;
		}

	} catch (error) {
		return {
			returncode: 500,
			message: error.message,
			output: []
		}
	}
}

export async function updateTodo(data) {
	try {
		// Params
		const todo_id = data['todo_id'] || null;
		const title = data['title'] || null;
		const description = data['description'] || null;

		if (title === null || description === null || todo_id === null) {
			return {
				returncode: 400,
				message: "Missing Required Params",
				output: []
			}
		}

		const result = await todosCrud.updateTodo({ todo_id, title, description });
		return result;

	} catch (error) {
		return {
			returncode: 500,
			message: error.message,
			output: []
		}
	}
}

export async function completeTodo(data) {
	try {
		// Params
		const todo_id = data['todo_id'] || null;

		if (todo_id === null) {
			return {
				returncode: 400,
				message: "Missing Required Params",
				output: []
			}
		}

		if (!syncService.isOnline) {
			return await todosOfflineCrud.completeTodo({ todo_id });
		} else {
			return await todosCrud.completeTodo({ todo_id });
		}

	} catch (error) {
		return {
			returncode: 500,
			message: error.message,
			output: []
		}
	}
}

export async function deleteTodo(data) {
	try {

		// Params
		const todo_id = data['todo_id'] || null;

		if (todo_id === null) {
			return {
				returncode: 400,
				message: "Missing Required Params",
				output: []
			}
		}

		if (!syncService.isOnline) {
			return await todosOfflineCrud.deleteTodo({ todo_id });
		} else {
			return await todosCrud.deleteTodo({ todo_id });
		}
	} catch (error) {
		return {
			returncode: 500,
			message: error.message,
			output: []
		}
	}
}
