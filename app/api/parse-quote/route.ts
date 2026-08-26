import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'Falta configurar la GEMINI_API_KEY en Vercel' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey.trim());
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Falta el texto de la instrucción' }, { status: 400 });
    }

    // Usamos gemini-1.5-pro para garantizar compatibilidad con tu llave de API
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
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
        responseMimeType: 'application/json',
      },
    });

    const responseText = result.response.text();
    const cleanText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const resultJson = JSON.parse(cleanText || '{}');

    return NextResponse.json({ success: true, data: resultJson });
  } catch (error: any) {
    console.error('Error detallado al procesar con Gemini:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message ? `Google Error: ${error.message}` : 'Error desconocido de red' 
    }, { status: 500 });
  }
}