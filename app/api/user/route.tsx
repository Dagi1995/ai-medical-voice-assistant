import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const user = await currentUser()  
  
  try{

  }catch(e){
    return NextResponse.json(e)
  }
}