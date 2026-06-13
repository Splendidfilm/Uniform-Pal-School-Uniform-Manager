// app/api/uniforms/[id]/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Resolve parameters asynchronously as per modern Next.js patterns
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Uniform ID is required" }, { status: 400 });
    }

    // Verify if document exists before deleting
    const docRef = getDb().collection("uniforms").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: "Uniform not found" }, { status: 404 });
    }

    // Delete document from Firestore
    await docRef.delete();

    return NextResponse.json({ message: "Uniform successfully deleted" }, { status: 200 });

  } catch (error: any) {
    console.error("🔥 DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete uniform" }, { status: 500 });
  }
}