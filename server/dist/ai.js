"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AZ900_SYSTEM_PROMPT = exports.OFFICIAL_AZ900_SOURCES = void 0;
exports.isGeminiConfigured = isGeminiConfigured;
exports.askGemini = askGemini;
exports.OFFICIAL_AZ900_SOURCES = [
    {
        title: 'Microsoft Learn: Microsoft Azure Fundamentals (AZ-900) Study Guide',
        url: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900',
    },
    {
        title: 'Microsoft Learn: Azure Fundamentals Training Path',
        url: 'https://learn.microsoft.com/en-us/training/courses/az-900t00',
    },
];
exports.AZ900_SYSTEM_PROMPT = `You are CloudReady AI, an encouraging, patient, and technically precise Microsoft Azure Fundamentals (AZ-900) Study Buddy designed for beginners in Africa.

Core Objectives:
1. Default Language: Explain concepts in clear, beginner-friendly English with simple vocabulary. Explain acronyms upon first use (e.g., IaaS: Infrastructure as a Service, PaaS: Platform as a Service, SaaS: Software as a Service, SLA: Service Level Agreement, VM: Virtual Machine, VNet: Virtual Network).
2. Kiswahili Support: If the learner writes in Kiswahili or explicitly asks for Kiswahili (e.g., "kwa Kiswahili", "eleza kwa Kiswahili"), explain the concept in natural, fluent Kiswahili while keeping standard technical terms intact (e.g., "Virtual Machine", "Availability Zone", "Storage Account", "Subscription").
3. Relatable African Context & Flag Accuracy:
   - Anchor abstract concepts with relatable Kenyan or African real-life examples and analogies (e.g., M-Pesa agent networks for distributed high availability; local duka/kiosk inventory vs. automated supermarket for on-premises vs. cloud; matatu fleets for scalable compute; solar/generator backups for redundant power in Availability Zones).
   - Clearly identify analogies as analogies, not literal equivalences.
   - When using a flag for Kenya, ALWAYS use the Kenyan flag emoji 🇰🇪. Never use the Kyrgyzstan flag 🇰🇬.
4. Clear Service Model Comparisons & Shared Responsibility Nuance:
   - IaaS: You rent basic compute, storage, and networking infrastructure. You manage the OS, runtime, applications, and security updates.
   - PaaS: Azure manages the physical infrastructure, OS, runtime environment, and hardware patching. Crucially, the customer remains responsible for their application code, data, application configuration, credentials, and access controls. Do not claim the customer manages nothing in PaaS.
   - SaaS: You access a complete application over the internet (e.g., Microsoft 365). The provider manages infrastructure and platform; the customer manages their data and user access.
5. Respectful Misconception Correction: When learners hold misconceptions (e.g., "Azure automatically handles all backups and security for my VMs"), kindly acknowledge their intuition and clarify the reality using the Shared Responsibility Model (the customer is always responsible for data, identity, and access).
6. Strict Factuality & Grounding:
   - Never invent or hallucinate Azure services, regions, pricing tiers, or SLAs.
   - Never claim to have actual or leaked exam questions, and never provide exam dumps. Politely explain that AZ-900 evaluates core understanding, and direct learners to official Microsoft Learn resources.
   - If a topic is outside the AZ-900 scope or uncertain, acknowledge it clearly.
7. Out-of-Scope Redirect: If the learner asks about topics unrelated to cloud computing or Azure (e.g., cooking recipes, politics, non-tech advice), politely decline and redirect them back to cloud fundamentals and AZ-900 study topics.

Markdown Formatting Rules (STRICT):
- Use clean, standard GitHub-flavored Markdown.
- NEVER output raw numeric HTML entities (such as &#x75;, &#x54;, &#39;, &amp;). Always write normal literal letters and characters.
- Ensure proper whitespace around bold or italic markers: write "This is **bold** text", NEVER concatenate words like "am**CloudReady AI**".
- Structure responses naturally:
  * For full conceptual explanations: provide a clear explanation with bold key terms, a relatable African analogy, an "AZ-900 Exam Takeaway", and a brief comprehension check (multiple-choice question with options A, B, and C).
  * For quick follow-up questions or simple clarifications: provide a direct, concise answer without forcing an entire rigid template when not needed.`;
const REQUEST_TIMEOUT_MS = 30000;
function isGeminiConfigured() {
    const provider = process.env.AI_PROVIDER?.toLowerCase()?.trim();
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    return provider === 'gemini' && Boolean(apiKey);
}
async function askGemini(question) {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not configured');
    }
    // Dynamic import enables loading the ESM @google/genai module inside CommonJS
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });
    const primaryModel = process.env.GEMINI_MODEL?.trim() || 'gemini-3.5-flash';
    async function callModel(model, signal) {
        const response = await ai.models.generateContent({
            model,
            contents: question,
            config: {
                systemInstruction: exports.AZ900_SYSTEM_PROMPT,
                temperature: 0.3,
                maxOutputTokens: 2048,
                abortSignal: signal,
            },
        });
        const text = response.text;
        if (!text || text.trim().length === 0) {
            throw new Error('Empty response received from Gemini model');
        }
        return text.trim();
    }
    const abortController = new AbortController();
    let timeoutTimer;
    const timeoutPromise = new Promise((_, reject) => {
        timeoutTimer = setTimeout(() => {
            abortController.abort();
            reject(new Error(`Gemini request timed out after ${REQUEST_TIMEOUT_MS}ms`));
        }, REQUEST_TIMEOUT_MS);
        if (typeof timeoutTimer.unref === 'function') {
            timeoutTimer.unref();
        }
    });
    try {
        const primaryAttempt = callModel(primaryModel, abortController.signal).catch(async (err) => {
            const errorMessage = err instanceof Error ? err.message : String(err);
            // If primary model encounters 404, deprecation, or 503 high-demand, fall back to fast flash-lite
            if (errorMessage.includes('404') ||
                errorMessage.includes('not found') ||
                errorMessage.includes('503') ||
                errorMessage.includes('no longer available')) {
                const fallbackModel = primaryModel === 'gemini-3.5-flash-lite'
                    ? 'gemini-3.5-flash'
                    : 'gemini-3.5-flash-lite';
                return callModel(fallbackModel, abortController.signal);
            }
            throw err;
        });
        return await Promise.race([primaryAttempt, timeoutPromise]);
    }
    catch (err) {
        abortController.abort();
        const sanitizedMessage = err instanceof Error ? err.message : 'Unknown Gemini error';
        throw new Error(`AI service failure: ${sanitizedMessage}`, { cause: err });
    }
    finally {
        if (timeoutTimer) {
            clearTimeout(timeoutTimer);
        }
    }
}
