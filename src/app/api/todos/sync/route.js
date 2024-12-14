import syncService from '../../../lib/services/syncService';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const todos = await request.json();
    const result = await syncService.syncTodos(todos);
    return NextResponse.json(result, { status: result.returncode === 200 ? 200 : 500 });
  } catch (error) {
    console.error('Sync Error:', error);
    return NextResponse.json({ returncode: 500, message: error.message, output: [] }, { status: 500 });
  }
} 