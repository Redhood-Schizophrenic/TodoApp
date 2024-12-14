import Todos from '../../../../lib/models/Todos';
import { NextResponse } from 'next/server';

export async function GET(request) {
	try {
		const completedTodos = await Todos.find({ Completed: true });
		return NextResponse.json({ returncode: 200, message: 'Completed todos fetched', output: completedTodos }, { status: 200 });
	} catch (error) {
		console.error('Fetch Completed Todos Error:', error);
		return NextResponse.json({ returncode: 500, message: error.message, output: [] }, { status: 500 });
	}
}
