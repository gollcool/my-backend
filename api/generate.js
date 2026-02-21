import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Только POST запросы" });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    // Получаем данные из запроса
    const { imageBase64, prompt } = req.body;

    // Отправляем фото и промпт в Gemini
    const response = await ai.models.generateContent({
      model: "gemini-1.5-pro",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: imageBase64
              }
            }
          ]
        }
      ]
    });

    // Возвращаем результат
    res.status(200).json({ result: response.text });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Ошибка генерации" });
  }
}
