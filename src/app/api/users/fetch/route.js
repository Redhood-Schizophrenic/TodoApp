import connectDB from '../../../lib/services/mongoConnection';
import Users from '../../../lib/models/Users';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await connectDB();
  try {
    const user = await Users.findOne({ Email: request.email }); // Replace with desired criteria
    if (user) {
      return NextResponse.json({ returncode: 200, message: 'User fetched successfully', output: user }, { status: 200 });
    } else {
      return NextResponse.json({ returncode: 404, message: 'User not found', output: [] }, { status: 404 });
    }
  } catch (error) {
    console.error('Fetch User Error:', error);
    return NextResponse.json({ returncode: 500, message: error.message, output: [] }, { status: 500 });
  }
} 
