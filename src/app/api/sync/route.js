import syncService from '../../../lib/services/syncService';

export async function POST(request) {
  try {
    await syncService.syncWithServer();
    return new Response(JSON.stringify({ returncode: 200, message: 'Sync successful' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ returncode: 500, message: error.message }), { status: 500 });
  }
} 