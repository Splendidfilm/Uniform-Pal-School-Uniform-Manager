// app/api/uniforms/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase";
import { cloudinary } from "@/lib/cloudinary";

// --- 1. GET: FETCH ALL UNIFORMS ---
export async function GET() {
  try {
    const snapshot = await getDb().collection("uniforms").orderBy("createdAt", "desc").get();
    const uniforms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    return NextResponse.json(uniforms, { status: 200 });
  } catch (error: any) {
    console.error("🔥 GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch uniforms" }, { status: 500 });
  }
}

// --- 2. POST: CREATE A NEW UNIFORM WITH IMAGES ---
export async function POST(request: Request) {
  try {
    // Next.js parses multipart form data natively! No Multer required.
    const formData = await request.formData();
    
    const school = formData.get("school") as string;
    const schoolType = formData.get("schoolType") as string;
    const uniformCombo = formData.get("uniformCombo") as string;
    const compoundWear = formData.get("compoundWear") as string;
    const churchWear = formData.get("churchWear") as string;

    if (!school || !uniformCombo) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Helper function to upload file buffers straight to Cloudinary
    const uploadToCloudinary = async (fileKey: string): Promise<string | null> => {
      const file = formData.get(fileKey) as File | null;
      if (!file || file.size === 0) return null;

      // Convert the file into a Node.js Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "uniform-pal-pro" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result?.secure_url || null);
          }
        );
        uploadStream.end(buffer);
      });
    };

    // Upload all 3 images concurrently to save time
    const [uniformImage, compoundImage, churchImage] = await Promise.all([
      uploadToCloudinary("uniformImage"),
      uploadToCloudinary("compoundImage"),
      uploadToCloudinary("churchImage"),
    ]);

    // Construct the database payload
    const newUniform = {
      school,
      schoolType,
      uniformCombo,
      compoundWear,
      churchWear,
      uniformImage,
      compoundImage,
      churchImage,
      createdAt: new Date().toISOString(), // Or use a timestamp utility
    };

    // Save to Firestore
    const docRef = await getDb().collection("uniforms").add(newUniform);

    return NextResponse.json({ id: docRef.id, ...newUniform }, { status: 201 });

  } catch (error: any) {
    console.error("🔥 POST Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}