import express from "express";
import cors from "cors";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import admin from "firebase-admin";
import dotenv from "dotenv"


dotenv.config();

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error("CRITICAL:FIREASE_SERVICE_ACCOUNT is missing in .env");
}

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
});

const db = admin.firestore()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})




app.get("/api/uniforms", async (req, res, next ) => {
try{
  const snapshot = await  db.collection("uniforms").orderBy({ id: document.id , ...docdata() })
  res.status(200).json(data);
}catch(error) {
  next(error)
}
});

app.post("/api/uniforms", upload.fields([
  {name:"uniformImage", maxCount:1},
  {name:"compoundImage", maxCount:1},
  {name:"churchImage", maxCount:1},
]), async (req, res, next ) => {
  try{
    const {school, schoolType, uniformCombo } = req.body;

    if (!school || !uniformCombo) {
      return res.status(400).json({ error: "Missing required fields: school or uniformCombo" })
    }

    const newEntry = {
      ...req.body,
      uniformIage: req.files?.uniformImages?.[0].path || null,
      compoundImage: req.files?.compoundImage?.[0].path || null,
      churchImage: req.files?.churchImage?.[0].path || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(), 
    };
    const docRef = await db.collection("uniforms").add(newEntry)
    res.status(201).json({ id: docRef.id, ...newEntry }) 

  }catch(error) {
    next(error)
  }
});

app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack );
  res.staus(500).json({
    success: false,
    message: err.message || "Internal Server Error" 
})
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`))
