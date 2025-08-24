import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { BlockedEntry } from '../../../../../lib/types';

// Helper function to safely parse dates
function parseLogDate(dateString: string): Date | null {
  try {
    // Try parsing as ISO string first
    const isoDate = new Date(dateString);
    if (!isNaN(isoDate.getTime())) return isoDate;

    // Try parsing common log formats
    const formats = [
      'MM/DD/YYYY, hh:mm:ss A',
      'YYYY-MM-DD HH:mm:ss',
      'DD-MM-YYYY HH:mm:ss'
    ];

    for (const format of formats) {
      const parsed = new Date(dateString);
      if (!isNaN(parsed.getTime())) return parsed;
    }

    return null;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const logPath = path.join('C:/integrity', 'block_log.txt');
    
    if (!fs.existsSync(logPath)) {
      return NextResponse.json([]);
    }

    // Read file in chunks to avoid memory issues
    const logContent = await new Promise<string>((resolve, reject) => {
      const chunks: string[] = [];
      const stream = fs.createReadStream(logPath, { encoding: 'utf-8' });
      
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(chunks.join('')));
      stream.on('error', reject);
    });

    const blocks: BlockedEntry[] = [];
    const entries = logContent.trim().split('\n\n').filter(entry => entry.trim() !== '');

    for (const entry of entries) {
      try {
        const lines = entry.split('\n');
        const timestampLine = lines.find(l => l.includes('Time:'));

        let timestamp: string;
        if (timestampLine) {
          const timePart = timestampLine.split('Time:')[1]?.trim();
          const parsedDate = timePart ? parseLogDate(timePart) : null;
          timestamp = parsedDate ? parsedDate.toISOString() : new Date().toISOString();
        } else {
          timestamp = new Date().toISOString();
        }

        blocks.push({
          id: `blocked-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          action: lines[0]?.trim() || 'Unknown Action',
          timestamp,
          details: lines
            .filter(l => !l.includes('Time:'))
            .join('\n')
            .trim() || 'No details available',
        });
      } catch (entryError) {
        console.error('Error processing log entry:', entryError);
        continue;
      }
    }

    return NextResponse.json(blocks.reverse());
  } catch (error) {
    console.error('Blocked Logs API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch blocked logs',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}