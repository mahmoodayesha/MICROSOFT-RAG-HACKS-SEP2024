import { NextResponse } from "next/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function POST(req) {
    try {
      const data = await req.formData();
      const file = data.get('file');

      if (!file) {
        throw new Error('No file provided');
      }

      const loader = new PDFLoader(file);
      const docs = await loader.load();

      console.log('PDF loaded successfully with length...', docs.length);



      return NextResponse.json(docs, { status: 200 });

    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Failed to search URL.' }, { status: 500 });
    }
}