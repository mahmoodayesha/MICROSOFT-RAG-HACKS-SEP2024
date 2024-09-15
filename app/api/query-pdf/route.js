import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';
import OpenAI from 'openai';
const { Pinecone: PineconeClient } = require('@pinecone-database/pinecone');

export async function POST(req) {
  try {
    const { question, resume } = await req.json();

    if (!question || !resume) {
      return NextResponse.json(
        { error: 'Missing question or resume content' },
        { status: 400 }
      );
    }

    // Hugging Face Inference API for Embeddings
    const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

    // Generate embeddings using Hugging Face
    const embeddingsResponse = await hf.featureExtraction({
      model: 'intfloat/multilingual-e5-large',
      inputs: resume,
    });

    console.log('Embeddings Response:', embeddingsResponse);

    // Check and process embeddings
    let vector;
    if (Array.isArray(embeddingsResponse)) {
      vector = embeddingsResponse; // Use the embeddings directly if it's an array
    } else {
      throw new Error('Unexpected embeddings format from Hugging Face API');
    }

    // Verify dimensions of the embeddings
    if (vector.length !== 1024) {
      throw new Error(`Vector dimension ${vector.length} does not match the dimension of the index 384`);
    }

    console.log('Processed vector:', vector);

    // Pinecone client initialization
    const pinecone = new PineconeClient({ apiKey: process.env.PINECONE_API_KEY });

    // Create index and insert embeddings into Pinecone
    const index = pinecone.Index('hackathon'); // Replace with your Pinecone index name

    await index.upsert([{ id: 'document1', values: vector, metadata: { text: resume } }]);

    console.log('Embeddings inserted into Pinecone');

    // Query Pinecone with the question
    const queryEmbeddingResponse = await hf.featureExtraction({
      model: 'intfloat/multilingual-e5-large',
      inputs: question,
    });

    console.log('Query Embedding Response:', queryEmbeddingResponse);

    let queryVector;
    if (Array.isArray(queryEmbeddingResponse)) {
      queryVector = queryEmbeddingResponse; // Use the embeddings directly if it's an array
    } else {
      throw new Error('Unexpected query embedding format from Hugging Face API');
    }

    // Verify dimensions of the query embeddings
    if (queryVector.length !== 1024) {
      throw new Error(`Query vector dimension ${queryVector.length} does not match the dimension of the index 384`);
    }

    const queryResponse = await index.query({
      topK: 3, // Get the top 3 results
      vector: queryVector,
      includeMetadata: true,
    });

    console.log('Pinecone query response:', queryResponse);

    const systemPrompt = `
      You are an assistant that reads the content of a PDF document and answers questions based on the text provided. Your task is to provide accurate answers based on the content of the document.

      Document: {{resume}}

      Question: {{question}}

      Return the answer in the following JSON format:
      {
          "answer": "str"
      }
      If the question cannot be answered based on the document, provide a response indicating that no relevant information was found.

      Respond with JSON only. Never include any extra characters, non-whitespace characters, comments, or explanations.
    `;

    const prompt = systemPrompt
      .replace('{{resume}}', resume)
      .replace('{{question}}', question);

    // Call OpenAI API to generate the answer
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
