import todosCrud from "@/app/lib/crud/todos";

export async function fetch_uncompleted_todos() {
	try {
		const result = await todosCrud.getUncompletedTodos();
		return result;
	} catch (error) {
		return {
			returncode: 500,
			message: error.message,
			output: []
		}
	}
}
