import todosCrud from "@/app/lib/crud/todos";

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

		const result = await todosCrud.createTodo({ title, description });
		return result;

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

		const result = await todosCrud.completeTodo({ todo_id });
		return result;

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

		const result = await todosCrud.deleteTodo({ todo_id });
		return result;
	} catch (error) {
		return {
			returncode: 500,
			message: error.message,
			output: []
		}
	}
}
