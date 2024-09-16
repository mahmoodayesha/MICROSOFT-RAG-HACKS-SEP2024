import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';
import OpenAI from 'openai';
const { Pinecone: PineconeClient } = require('@pinecone-database/pinecone');

export async function POST(req) {
  try {
    const requestBody = await req.json();
    console.log('Received request body:', requestBody);

    const { question } = requestBody;

    if (typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input format' },
        { status: 400 }
      );
    }

    const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

    const queryEmbeddingResponse = await hf.featureExtraction({
      model: 'intfloat/multilingual-e5-large',
      inputs: question,
    });

    console.log('Query Embedding Response:', queryEmbeddingResponse);

    let queryVector;
    if (Array.isArray(queryEmbeddingResponse)) {
      queryVector = queryEmbeddingResponse;
    } else {
      throw new Error('Unexpected query embedding format from Hugging Face API');
    }

    const expectedDimension = 1024;
    if (queryVector.length !== expectedDimension) {
      throw new Error(`Query vector dimension ${queryVector.length} does not match the dimension of the index ${expectedDimension}`);
    }

    const pinecone = new PineconeClient({ apiKey: process.env.PINECONE_API_KEY });
    const index = pinecone.Index('hackathon');

    const queryResponse = await index.query({
      topK: 3,
      vector: queryVector,
      includeMetadata: true,
    });

    console.log('Pinecone query response:', queryResponse);

    const systemPrompt = `
      You are an assistant that reads the content of a PDF document and answers questions based on the text provided. Your task is to provide accurate answers based on the content of the document.

      Document: {{resume}}

      Question: {{question}}

      Provide the answer in plain text only. Do not include any JSON formatting or additional characters. Just respond with the answer as plain text.
    `;


    const prompt = systemPrompt
      .replace('{{resume}}', queryResponse.matches.map(match => match.metadata.text).join(' '))
      .replace('{{question}}', question);

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: question },
      ],
      temperature: 0.7,
    });

    const answer = completion.choices[0]?.message?.content.trim();
    const response = { answer };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error during API request:', error.message);
    return NextResponse.json(
      { error: 'An error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
