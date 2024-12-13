import { verifyToken } from '@/app/lib/utils/jwt';
import { completeTodo, createTodo, deleteTodo, updateTodo } from './controller';
import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/db/connect';

export async function POST(request) {
	try {
		await dbConnect();

		// Get token from cookie
		let token = request.cookies.get('auth_token')?.value;
		if (!token) {
			return NextResponse.json({
				returncode: 401,
				message: "No token provided",
				output: []
			}, { status: 401 });
		}

		// Verify the token
		const userData = verifyToken(token);
		if (!userData) {
			return NextResponse.json({
				returncode: 401,
				message: "Invalid or expired token",
				output: []
			}, { status: 401 });
		}

		const data = await request.json();
		const result = await createTodo(data);

		return NextResponse.json(result, { status: result.returncode });
	} catch (error) {
		return NextResponse.json(
			{
				returncode: 500,
				message: error.message,
				output: []
			},
			{ status: 500 }
		);
	}
}

export async function PUT(request) {
	try {

		// Get token from cookie
		let token = request.cookies.get('auth_token')?.value;
		if (!token) {
			return NextResponse.json({
				returncode: 401,
				message: "No token provided",
				output: []
			}, { status: 401, statusText: "No token provided" });
		}

		// Verify the token
		const userData = verifyToken(token);
		if (!userData) {
			return NextResponse.json({
				returncode: 401,
				message: "Invalid or expired token",
				output: []
			}, { status: 401, statusText: "Invalid or expired token" });
		}

		const data = await request.json();
		const result = await updateTodo(data);

		return NextResponse.json({
			returncode: result.returncode,
			message: result.message,
			output: result.output
		}, {
			status: result.returncode,
		});
	} catch (error) {
		return NextResponse.json(
			{
				returncode: 500,
				message: error.message,
				output: []
			},
			{ status: 500 }
		);
	}
}

export async function PATCH(request) {
	try {

		// Get token from cookie
		let token = request.cookies.get('auth_token')?.value;
		if (!token) {
			return NextResponse.json({
				returncode: 401,
				message: "No token provided",
				output: []
			}, { status: 401, statusText: "No token provided" });
		}

		// Verify the token
		const userData = verifyToken(token);
		if (!userData) {
			return NextResponse.json({
				returncode: 401,
				message: "Invalid or expired token",
				output: []
			}, { status: 401, statusText: "Invalid or expired token" });
		}

		const data = await request.json();
		const result = await completeTodo(data);

		return NextResponse.json({
			returncode: result.returncode,
			message: result.message,
			output: result.output
		}, {
			status: result.returncode,
		});
	} catch (error) {
		return NextResponse.json(
			{
				returncode: 500,
				message: error.message,
				output: []
			},
			{ status: 500 }
		);
	}
}

export async function DELETE(request) {
	try {

		// Get token from cookie
		let token = request.cookies.get('auth_token')?.value;
		if (!token) {
			return NextResponse.json({
				returncode: 401,
				message: "No token provided",
				output: []
			}, { status: 401, statusText: "No token provided" });
		}

		// Verify the token
		const userData = verifyToken(token);
		if (!userData) {
			return NextResponse.json({
				returncode: 401,
				message: "Invalid or expired token",
				output: []
			}, { status: 401, statusText: "Invalid or expired token" });
		}

		const data = await request.json();
		const result = await deleteTodo(data);

		return NextResponse.json({
			returncode: result.returncode,
			message: result.message,
			output: result.output
		}, {
			status: result.returncode,
		});
	} catch (error) {
		return NextResponse.json(
			{
				returncode: 500,
				message: error.message,
				output: []
			},
			{ status: 500 }
		);
	}
}
