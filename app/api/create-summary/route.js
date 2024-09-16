import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';
import OpenAI from 'openai';
const { Pinecone: PineconeClient } = require('@pinecone-database/pinecone');

export async function POST(req) {
  try {
    const { resume } = await req.json();

    if (!resume) {
      return NextResponse.json(
        { error: 'Missing resume content' },
        { status: 400 }
      );
    }

    const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

    const embeddingsResponse = await hf.featureExtraction({
      model: 'intfloat/multilingual-e5-large',
      inputs: resume,
    });

    console.log('Embeddings Response:', embeddingsResponse);

    let vector;
    if (Array.isArray(embeddingsResponse)) {
      vector = embeddingsResponse;
    } else {
      throw new Error('Unexpected embeddings format from Hugging Face API');
    }

    if (vector.length !== 1024) {
      throw new Error(`Vector dimension ${vector.length} does not match the dimension of the index 384`);
    }

    console.log('Processed vector:', vector);

    const pinecone = new PineconeClient({ apiKey: process.env.PINECONE_API_KEY });
    const index = pinecone.Index('hackathon'); 

    await index.upsert([{ id: 'document1', values: vector, metadata: { text: resume } }]);

    console.log('Embeddings inserted into Pinecone');

    const systemPrompt = `
      You are an assistant that reads the content of a PDF document and summarizes it. Your task is to provide a clear and concise summary of the content of the document.

      Document: {{resume}}

      Return the summary in plain text. Do not include any JSON format or additional formatting. Just provide the summary in plain text.
    `;


    const prompt = systemPrompt.replace('{{resume}}', resume);

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: prompt },
      ],
      temperature: 0.7,
    });

    const summary = completion.choices[0]?.message?.content.trim();

    return NextResponse.json({ summary });

  } catch (error) {
    console.error('Error during API request:', error.message);
    return NextResponse.json(
      { error: 'An error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
