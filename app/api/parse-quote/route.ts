import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Inicializamos Gemini con su variable de entorno
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Falta el texto de la instrucción' }, { status: 400 });
    }

    // Usamos gemini-1.5-flash (ideal por su velocidad y bajo costo/gratuito para desarrollo)
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: `Eres un asistente experto para un software de cotizaciones. 
      Tu tarea es analizar la instrucción en lenguaje natural del usuario y extraer la información en un formato JSON estricto con esta estructura exacta:
      {
        "clientName": "Nombre del cliente detectado o string vacío si no hay",
        "items": [
          {
            "description": "Descripción clara del producto o servicio",
            "quantity": 1,
            "unitPrice": 0.0
          }
        ]
      }
      Si no se especifica precio unitario, pon 0. Si no se especifica cantidad, pon 1. Responde ÚNICAMENTE con el JSON válido, sin texto adicional.`,
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json', // Esto obliga a Gemini a devolver JSON puro
      },
    });

    const responseText = result.response.text();
    const resultJson = JSON.parse(responseText || '{}');

    return NextResponse.json({ success: true, data: resultJson });
  } catch (error: any) {
    console.error('Error al procesar la cotización con Gemini:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}