import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { word } = req.body;

    if (!word) {
        return res.status(400).json({ error: '단어를 입력해주세요.' });
    }

    if (word.length !== 3) {
        return res.status(400).json({ error: '3글자 단어를 입력해주세요.' });
    }

    try {
        const client = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });

        const message = await client.messages.create({
            model: 'claude-sonnet-4-5-20250929',
            max_tokens: 20000,
            temperature: 1,
            system: '당신은 삼행시 작가입니다.\n사용자가 입력한 3글자로 삼행시를 작성하세요.\n\n규칙:\n1. 각 글자로 시작하는 문장을 작성합니다\n2. 긍정적이고 유머러스한 톤을 유지합니다\n3. 각 줄은 자연스럽게 이어져야 합니다\n\n출력 형식 (반드시 이 형식만 출력):\n[첫번째글자]: [문장]\n[두번째글자]: [문장]\n[세번째글자]: [문장]\n\n주의: 삼행시 3줄만 출력하세요. 인사말, 설명, 부연설명 등 다른 텍스트는 절대 포함하지 마세요.',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `${word}\n`,
                        },
                    ],
                },
            ],
        });

        const threeLine = message.content[0].text;

        return res.status(200).json({ threeLine });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'API 호출 중 오류가 발생했습니다.' });
    }
}
