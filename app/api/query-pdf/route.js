import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';
import OpenAI from 'openai';

export async function POST(req) {
    try {
        const { question, resume } = await req.json();

        if (!question || !resume) {
            return NextResponse.json(
                { error: 'Missing question or resume content' },
                { status: 400 }
            );
        }

        const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

        const embeddings = await hf.featureExtraction({
            model: 'sentence-transformers/all-MiniLM-L6-v2',
            inputs: resume,
        });

        console.log('Embeddings:', embeddings);

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
