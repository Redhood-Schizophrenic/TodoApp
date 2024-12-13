import todosCrud from "@/app/lib/crud/todos";

export async function fetch_completed_todos() {
	try {
		const result = await todosCrud.getCompletedTodos();
		return result;
	} catch (error) {
		return {
			returncode: 500,
			message: error.message,
			output: []
		}
	}
}
