import dotenv from 'dotenv';

dotenv.config(); // dotenv is used to load environment variables from a .env file

interface OpenAIResponse {
    choices: Array<{
        message: {
            content: string;
        };
    }>;
}

export const categorizeExpense = async (description: string): Promise<string> => {
    // If no OpenAI key, use simple keyboard matching
    if (!process.env.OPENAI_API_KEY) {
        console.log('No OpenAI API key found, using simple categorization for:', description);
        return getSimpleCategory(description);
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant that categorizes expenses. Respond with only one of these categories: Food & Dining, Transportation, Shopping, Entertainment, Utilities, Healthcare, Travel, Education, Other'
                    },
                    {
                        role: 'user',
                        content: `Categorize this expense: "${description}"`
                    }
                ],
                max_tokens: 50,
                temperature: 0.1,
            })
        });

        const data = await response.json() as OpenAIResponse;
        const category = data.choices[0]?.message?.content?.trim();

        console.log(`AI categorized "${description}" as "${category}"`);
        return category || 'Other'; // Default to 'Other' if no category is returned

    } catch (error) {
        console.error('Error with AI categorization:', error);
        return getSimpleCategory(description);
    }
};

// Fallback categorization using keywords
const getSimpleCategory = (description: string): string => {
    const desc = description.toLowerCase();

    if (desc.includes('coffee') || desc.includes('restaurant') || desc.includes('food') || desc.includes('lunch') || desc.includes('dinner') || desc.includes('starbucks') || desc.includes('mcdonald')) {
        return 'Food & Dining';
    }
    if (desc.includes('uber') || desc.includes('gas') || desc.includes('parking') || desc.includes('bus') || desc.includes('taxi')) {
        return 'Transportation';
    }
    if (desc.includes('amazon') || desc.includes('store') || desc.includes('shopping') || desc.includes('clothes')) {
        return 'Shopping';
    }
    if (desc.includes('movie') || desc.includes('netflix') || desc.includes('spotify') || desc.includes('game')) {
        return 'Entertainment';
    }
    if (desc.includes('electric') || desc.includes('water') || desc.includes('internet') || desc.includes('phone')) {
        return 'Utilities';
    }

    return 'Other';
}