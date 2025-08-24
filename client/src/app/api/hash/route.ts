import { NextResponse } from 'next/server';
import { getStoredHash, verifyHash } from '../../../../lib/blockchain';
import fs from 'fs';
import path from 'path';
import { HashData } from '../../../../lib/types';

export async function GET() {
  try {
    const filePath = path.join('C:/integrity', 'final_hash.txt');
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Hash file not found' },
        { status: 404 }
      );
    }

    const currentHash = fs.readFileSync(filePath, 'utf-8').trim();
    const storedHash = await getStoredHash();
    const isValid = await verifyHash(currentHash);

    const responseData: HashData = {
      currentHash,
      storedHash,
      isValid,
      lastChecked: new Date().toISOString(),
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Hash API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch hash data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}