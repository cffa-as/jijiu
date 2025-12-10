import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const askEmergencyAssistant = async (query: string): Promise<string> => {
  try {
    const ai = getClient();
    if (!ai) return "请配置 API Key 以使用智能助手。";

    // Use flash for speed
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        systemInstruction: `你是一个紧急救援专家。请根据用户描述的情况，提供简洁、准确、分步骤的急救建议或指导。
        - 如果是危急生命的情况，第一条必须提示“立即拨打急救电话”。
        - 回答结构清晰，使用 Markdown 格式。
        - 语气冷静、专业、直接。
        - 不要提供模糊的建议。
        `,
        temperature: 0.4, // Low temperature for more deterministic/safe answers
      }
    });

    return response.text || "暂时无法获取建议，请参考离线指南。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "网络连接失败或服务不可用，请使用离线急救卡片。";
  }
};
