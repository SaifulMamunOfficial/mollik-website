import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to store the visitor count
const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'visitor.json');

// Interface for the data structure
interface VisitorData {
    count: number;
    lastUpdated: string;
}

// Helper to read data
function getVisitorData(): VisitorData {
    try {
        if (fs.existsSync(DATA_FILE_PATH)) {
            const fileContent = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
            return JSON.parse(fileContent);
        }
    } catch (error) {
        console.error("Error reading visitor data:", error);
    }

    // Default data if file doesn't exist or error
    return { count: 15234, lastUpdated: new Date().toISOString() };
}

// Helper to write data
function saveVisitorData(data: VisitorData) {
    try {
        const dirPath = path.dirname(DATA_FILE_PATH);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error("Error saving visitor data:", error);
    }
}

export async function GET() {
    const data = getVisitorData();
    return NextResponse.json(data);
}

export async function POST() {
    const data = getVisitorData();

    // Increment count
    data.count += 1;
    data.lastUpdated = new Date().toISOString();

    saveVisitorData(data);

    return NextResponse.json(data);
}
