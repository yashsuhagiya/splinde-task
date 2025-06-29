import { demoData } from "@/lib/demoData";
import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json(demoData);
}
