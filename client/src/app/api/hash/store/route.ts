import { NextResponse } from 'next/server';
import { storeHash } from '../../../../../lib/blockchain';
import fs from 'fs';
import path from 'path';

export async function POST() {
  try {
    const filePath = path.join('C:/integrity', 'final_hash.txt');
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Hash file not found' },
        { status: 404 }
      );
    }

    const currentHash = fs.readFileSync(filePath, 'utf-8').trim();
    const txHash = await storeHash(currentHash);

    // Create backup
    const csvPath = path.join('C:/integrity', 'system_hashes.csv');
    if (fs.existsSync(csvPath)) {
      fs.copyFileSync(csvPath, path.join('C:/integrity', 'system_hashes_backup.csv'));
    }

    return NextResponse.json({ 
      success: true, 
      txHash,
      message: 'Hash successfully stored on blockchain'
    });
  } catch (error) {
    console.error('Store Hash API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to store hash',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}