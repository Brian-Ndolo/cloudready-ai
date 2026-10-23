"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const ai_js_1 = require("./ai.js");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 3000;
// In production the compiled server lives at server/dist/index.js.
// The React build is output to dist/ at the project root (two levels up).
const FRONTEND_DIST = path_1.default.join(__dirname, '..', '..', 'dist');
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10kb' }));
// Serve the built React frontend as static files
app.use(express_1.default.static(FRONTEND_DIST));
// --------------------
// Curated AZ-900 lessons
// --------------------
const curatedLessons = [
    {
        title: 'What Is Cloud Computing?',
        keywords: [
            'cloud computing',
            'cloud services',
            'what is the cloud',
        ],
        answer: 'Cloud computing is the delivery of computing services over the internet. These services can include servers, storage, databases, networking, and software. Instead of buying and maintaining all the necessary physical equipment yourself, you can use services provided by a cloud provider such as Microsoft Azure.\n\nKenyan example: A small business in Nairobi could store its business records using a cloud service rather than relying only on one computer in its office.\n\nKey benefits include scalability, flexibility, and paying for resources according to your usage and pricing agreement.',
        sources: [
            {
                title: 'Microsoft Learn: Describe cloud computing',
                url: 'https://learn.microsoft.com/en-us/training/modules/describe-cloud-compute/',
            },
            {
                title: 'Microsoft Azure: What is cloud computing?',
                url: 'https://azure.microsoft.com/en-us/resources/cloud-computing-dictionary/what-is-cloud-computing/',
            },
        ],
    },
    {
        title: 'Azure Availability Zones',
        keywords: [
            'availability zone',
            'availability zones',
            'zones in azure',
        ],
        answer: 'Azure Availability Zones are physically separate locations within a supported Azure region. Each zone has independent infrastructure, including power, cooling, and networking.\n\nThey help protect supported applications and services from certain datacenter-level failures. Depending on the service and architecture, an application can use multiple zones to improve resilience.\n\nKenyan example: A business could design a supported application to run across multiple availability zones so that a problem affecting one zone does not necessarily stop the entire application.\n\nRemember: Availability Zones do not eliminate every possible failure, and not every Azure service or region supports them.',
        sources: [
            {
                title: 'Microsoft Learn: Azure Availability Zones overview',
                url: 'https://learn.microsoft.com/en-us/azure/reliability/availability-zones-overview',
            },
            {
                title: 'Microsoft Learn: Azure regions',
                url: 'https://learn.microsoft.com/en-us/azure/reliability/regions-overview',
            },
        ],
    },
    {
        title: 'IaaS, PaaS, and SaaS',
        keywords: [
            'iaas',
            'paas',
            'saas',
            'service models',
            'cloud service models',
            'difference between iaas paas and saas',
        ],
        answer: 'Cloud providers offer services in different ways. The three common cloud service models are IaaS, PaaS, and SaaS.\n\n1. IaaS (Infrastructure as a Service): You rent computing infrastructure, such as virtual machines, storage, and networking. You manage the operating system and much of the software running on it.\n\n2. PaaS (Platform as a Service): You get a managed environment for building and running applications. You focus more on your code and application while the provider manages more of the underlying infrastructure.\n\n3. SaaS (Software as a Service): You use a complete application over the internet without managing its underlying infrastructure.\n\nKenyan example: Imagine a small business in Nairobi launching an online shop.\n\n- With IaaS, the business rents a virtual machine and manages the software needed to run its website.\n- With PaaS, the developer deploys the shop application to a managed platform without managing the underlying servers directly.\n- With SaaS, the business uses an existing online business application instead of building and managing that software itself.\n\nEasy way to remember: IaaS gives you infrastructure, PaaS gives you a platform, and SaaS gives you software.\n\nThe provider manages more of the underlying technology as you move from IaaS to PaaS to SaaS. The exact responsibilities depend on the service.',
        sources: [
            {
                title: 'Microsoft Learn: Describe cloud service types',
                url: 'https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/',
            },
            {
                title: 'Microsoft Azure: Cloud computing dictionary',
                url: 'https://azure.microsoft.com/en-us/resources/cloud-computing-dictionary/',
            },
        ],
    },
    {
        title: 'Azure Regions',
        keywords: [
            'azure region',
            'azure regions',
            'geography',
            'region pairs',
        ],
        answer: 'An Azure region is a geographical area containing one or more datacenters connected through a regional network. Azure services are deployed in specific regions, although availability varies by service.\n\nOrganizations choose regions based on factors such as service availability, latency, data residency requirements, and resilience needs.\n\nKenyan example: A Kenyan application team should check which Azure regions offer the services it needs and evaluate network latency and applicable data requirements before choosing where to deploy.\n\nA region and an Availability Zone are not the same thing: a region is a geographical area, while zones are separate physical locations within a supported region.',
        sources: [
            {
                title: 'Microsoft Learn: Azure regions overview',
                url: 'https://learn.microsoft.com/en-us/azure/reliability/regions-overview',
            },
            {
                title: 'Microsoft Azure global infrastructure',
                url: 'https://azure.microsoft.com/en-us/explore/global-infrastructure/geographies/',
            },
        ],
    },
    {
        title: 'Shared Responsibility Model',
        keywords: [
            'shared responsibility',
            'customer responsibility',
            'cloud security responsibilities',
        ],
        answer: 'The shared responsibility model explains how security and management responsibilities are divided between the cloud provider and the customer.\n\nMicrosoft manages the underlying cloud infrastructure. Customers remain responsible for areas such as their data, identities, access permissions, and configurations, although the exact division depends on the service.\n\nGenerally, customers manage more of the software stack with IaaS than with PaaS or SaaS.\n\nKenyan example: Even if a business stores files in a cloud service, it must still manage who can access those files and protect its account credentials.\n\nRemember: Moving to the cloud does not remove all your security responsibilities.',
        sources: [
            {
                title: 'Microsoft Learn: Shared responsibility in the cloud',
                url: 'https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility',
            },
        ],
    },
    {
        title: 'Cloud Deployment Models',
        keywords: [
            'public cloud',
            'private cloud',
            'hybrid cloud',
            'deployment models',
        ],
        answer: 'The main cloud deployment models include public cloud, private cloud, and hybrid cloud.\n\nPublic cloud: Services are provided over shared cloud infrastructure operated by a cloud provider.\n\nPrivate cloud: Cloud infrastructure is dedicated to a single organization.\n\nHybrid cloud: An organization combines public cloud services with private cloud or other infrastructure, integrating them to work together.\n\nKenyan example: A company might keep some systems in its own facilities while using Azure for other workloads. This could form part of a hybrid approach if those environments are integrated.\n\nThe best model depends on business requirements, security, cost, and operational needs.',
        sources: [
            {
                title: 'Microsoft Learn: Describe cloud service types',
                url: 'https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/',
            },
            {
                title: 'Microsoft Azure: Cloud computing dictionary',
                url: 'https://azure.microsoft.com/en-us/resources/cloud-computing-dictionary/',
            },
        ],
    },
    {
        title: 'Azure Pricing and Cost Management',
        keywords: [
            'azure pricing',
            'cloud pricing',
            'cost management',
            'pay as you go',
            'cloud costs',
        ],
        answer: 'Cloud pricing depends on the services you use, the resources you consume, and the pricing terms that apply. Some services support pay-as-you-go pricing, while other purchasing options may offer different rates or commitments.\n\nImportant cost considerations include the size and number of resources, how long they run, storage, data transfers, and the selected service or region.\n\nKenyan example: A small online shop could monitor its cloud spending and shut down development resources when they are not needed, where appropriate, to help control costs.\n\nUse Azure pricing information and cost-management tools to estimate, monitor, and manage spending. Actual charges depend on your configuration and applicable prices.',
        sources: [
            {
                title: 'Microsoft Azure Pricing',
                url: 'https://azure.microsoft.com/en-us/pricing/',
            },
            {
                title: 'Microsoft Learn: Azure Cost Management',
                url: 'https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/',
            },
        ],
    },
];
// --------------------
// AZ-900 practice quiz
// --------------------
const quizQuestions = [
    {
        id: 1,
        question: 'What is cloud computing?',
        options: [
            'Using only a computer without internet',
            'Delivering computing services over the internet',
            'Storing all files on a USB drive',
            'Building physical computers for every user',
        ],
        correctAnswer: 1,
        explanation: 'Cloud computing delivers services such as computing, storage, and databases over the internet.',
    },
    {
        id: 2,
        question: 'Which cloud service model provides a complete software application?',
        options: ['IaaS', 'PaaS', 'SaaS', 'LAN'],
        correctAnswer: 2,
        explanation: 'Software as a Service (SaaS) lets users access a complete application managed by its provider.',
    },
    {
        id: 3,
        question: 'What is a key benefit of Azure Availability Zones?',
        options: [
            'They prevent every possible service failure',
            'They provide separate physical locations within an Azure region',
            'They make every Azure service free',
            'They eliminate the need for backups',
        ],
        correctAnswer: 1,
        explanation: 'Availability Zones are physically separate locations within a supported Azure region and can help protect supported workloads from certain datacenter failures.',
    },
    {
        id: 4,
        question: 'In the shared responsibility model, who is responsible for customer data?',
        options: [
            'Only the cloud provider',
            'Only the internet service provider',
            'The customer, with responsibilities depending on the service',
            'Nobody',
        ],
        correctAnswer: 2,
        explanation: 'Customers remain responsible for their data and how it is managed and protected, although exact responsibilities vary by service.',
    },
    {
        id: 5,
        question: 'What is a hybrid cloud?',
        options: [
            'A combination of public cloud and private infrastructure',
            'A computer that never connects to a network',
            'A cloud service used only for email',
            'A public cloud with no security controls',
        ],
        correctAnswer: 0,
        explanation: 'A hybrid cloud combines public cloud services with private cloud or other infrastructure, often integrating them to work together.',
    },
];
// --------------------
// Health check
// --------------------
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        message: 'CloudReady AI backend is running!',
        learningMode: (0, ai_js_1.isGeminiConfigured)() ? 'gemini' : 'curated',
    });
});
// --------------------
// Curated lesson helper
// --------------------
function getCuratedLesson(question) {
    const normalizedQuestion = question.toLowerCase().trim();
    const lesson = curatedLessons.find((item) => item.keywords.some((keyword) => normalizedQuestion.includes(keyword)));
    if (!lesson) {
        return {
            mode: 'curated',
            title: 'Let’s keep learning Azure fundamentals',
            answer: 'I could not find a matching curated lesson for that question yet. Try asking about cloud computing, Azure regions, Availability Zones, IaaS/PaaS/SaaS, the shared responsibility model, cloud deployment models, or Azure pricing.\n\nFor more topics, consult the official AZ-900 study guide.',
            sources: [
                {
                    title: 'Microsoft Learn: AZ-900 study guide',
                    url: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900',
                },
            ],
        };
    }
    return {
        mode: 'curated',
        title: lesson.title,
        answer: lesson.answer,
        sources: lesson.sources,
    };
}
// --------------------
// Ask a learning question
// --------------------
app.post('/api/ask', async (req, res) => {
    const question = req.body?.question;
    if (typeof question !== 'string' || question.trim().length === 0) {
        res.status(400).json({
            error: 'Please provide a question.',
        });
        return;
    }
    if (question.length > 1000) {
        res.status(400).json({
            error: 'Your question must be 1000 characters or fewer.',
        });
        return;
    }
    const trimmedQuestion = question.trim();
    // 1. Try Gemini AI if configured
    if ((0, ai_js_1.isGeminiConfigured)()) {
        try {
            const aiAnswer = await (0, ai_js_1.askGemini)(trimmedQuestion);
            res.json({
                mode: 'ai',
                title: 'CloudReady AI Study Buddy',
                answer: aiAnswer,
                sources: ai_js_1.OFFICIAL_AZ900_SOURCES,
            });
            return;
        }
        catch (err) {
            const reason = err instanceof Error ? err.message : 'Unknown error';
            console.warn(`[AI Tutor] Gemini generation failed (${reason}). Falling back to curated lesson.`);
        }
    }
    // 2. Fallback to curated lesson matching
    const fallbackResponse = getCuratedLesson(trimmedQuestion);
    res.json(fallbackResponse);
});
// --------------------
// Get quiz questions
// Correct answers are not sent to the browser.
// --------------------
app.get('/api/quiz', (_req, res) => {
    const questions = quizQuestions.map(({ id, question, options }) => ({
        id,
        question,
        options,
    }));
    res.json({
        total: questions.length,
        questions,
    });
});
app.post('/api/quiz/submit', (req, res) => {
    const answers = req.body?.answers;
    if (!Array.isArray(answers) ||
        answers.length !== quizQuestions.length) {
        res.status(400).json({
            error: `Please submit answers for all ${quizQuestions.length} questions.`,
        });
        return;
    }
    const validAnswers = answers.every((answer) => answer !== null &&
        typeof answer === 'object' &&
        Number.isInteger(answer.questionId) &&
        Number.isInteger(answer.selectedOption));
    if (!validAnswers) {
        res.status(400).json({
            error: 'Each answer must contain a questionId and selectedOption number.',
        });
        return;
    }
    const submittedIds = answers.map((answer) => answer.questionId);
    if (new Set(submittedIds).size !== quizQuestions.length) {
        res.status(400).json({
            error: 'Each question must be answered exactly once.',
        });
        return;
    }
    const results = [];
    for (const answer of answers) {
        const question = quizQuestions.find((item) => item.id === answer.questionId);
        if (!question) {
            res.status(400).json({
                error: `Unknown question ID: ${answer.questionId}.`,
            });
            return;
        }
        if (answer.selectedOption < 0 ||
            answer.selectedOption >= question.options.length) {
            res.status(400).json({
                error: `Invalid option for question ${question.id}.`,
            });
            return;
        }
        const isCorrect = answer.selectedOption === question.correctAnswer;
        results.push({
            questionId: question.id,
            selectedOption: answer.selectedOption,
            correctOption: question.correctAnswer,
            isCorrect,
            explanation: question.explanation,
        });
    }
    const score = results.filter((result) => result.isCorrect).length;
    res.json({
        total: quizQuestions.length,
        score,
        percentage: Math.round((score / quizQuestions.length) * 100),
        results,
    });
});
// SPA catch-all: serve index.html for any route not matched by the API
// This must come AFTER all /api/* routes
app.get('*', (_req, res) => {
    res.sendFile(path_1.default.join(FRONTEND_DIST, 'index.html'));
});
app.listen(PORT, () => {
    const currentMode = (0, ai_js_1.isGeminiConfigured)() ? 'gemini AI' : 'curated';
    console.log(`CloudReady AI API running at http://localhost:${PORT}`);
    console.log(`Learning mode: ${currentMode} content`);
});
