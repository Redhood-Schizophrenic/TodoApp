// src/app/api/auth/status/route.js
import { NextResponse } from 'next/server';
import Users from '../../../lib/models/Users';
import { verifyToken } from '@/app/utils/jwt';

export async function GET(request) {
	try {
		const cookie = request.cookies.get('auth_token');
		if (!cookie) {
			return NextResponse.json({ authenticated: false }, { status: 200 });
		}

		// Verify the token (implement your own verification logic)
		const userInfo = verifyToken(cookie.value); // You need to implement verifyToken
		if (!userInfo) {
			return NextResponse.json({ authenticated: false }, { status: 200 });
		}
		console.log(userInfo.user);

		const user = await Users.findById(userInfo.user.id).lean();
		if (!user) {
			return NextResponse.json({ authenticated: false }, { status: 200 });
		}

		return NextResponse.json({ authenticated: true, user }, { status: 200 });
	} catch (error) {
		console.error('Auth status check failed:', error);
		return NextResponse.json({ authenticated: false }, { status: 500 });
	}
}
