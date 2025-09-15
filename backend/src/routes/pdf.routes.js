import express from "express";
import upload from "../controllers/multer.js";
import pdfDetails from "../models/pdf.model.js";

const router = express.Router();

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No file uploaded");

    const title = req.body.title;
    const fileData = req.file.buffer;
    const contentType = req.file.mimetype;

    const doc=await pdfDetails.create({
      title,
      pdf: { data: fileData, contentType }
    });

    res.status(200).json({doc});
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error uploading file");
  }
});

router.get("/pdf/:id", async (req, res) => {
  try {
    const pdf = await pdfDetails.findById(req.params.id);
    if (!pdf) return res.status(404).send("PDF not found");

    // Set headers to prompt download or display
    res.set({
      "Content-Type": pdf.pdf.contentType,
      "Content-Disposition": `inline; filename="${pdf.title}.pdf"`
    });

    res.send(pdf.pdf.data); // send Buffer directly
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error fetching PDF");
  }
});

export default router;