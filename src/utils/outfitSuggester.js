export async function suggestOutfit(items) {
    const available = items.filter(item => item.isAvailable);
    
    if (available.length < 2) {
        return { error: "Not enough clean clothes available to make an outfit." };
    }

    const hfKey = import.meta.env.VITE_HF_API_KEY;
    if (!hfKey) {
        return { error: "Your Hugging Face API key is missing. Please check .env.local!" };
    }

    const itemsText = available.map(item => 
        `ID: ${item.id} | Category: ${item.category} | Color: ${item.color} | Pattern: ${item.pattern || 'none'} | Material: ${item.material || 'unknown'}`
    ).join('\n');

    const prompt = `You are a professional men's fashion stylist. 
Here is the available wardrobe:
${itemsText}

Pick exactly ONE top, ONE bottom, and ONE pair of shoes to make a classy, cohesive outfit. 
Respond ONLY with a valid JSON object in this exact format:
{
  "top_id": "id_here",
  "bottom_id": "id_here",
  "shoe_id": "id_here",
  "jacket_id": "id_here_or_null",
  "belt_id": "id_here_or_null",
  "reasoning": "A 1 sentence explanation of why this outfit works."
}`;

    try {
        const response = await fetch('/hf-api/models/meta-llama/Llama-3.2-3B-Instruct', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${hfKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                inputs: prompt,
                parameters: { max_new_tokens: 300, return_full_text: false }
            })
        });

        if (!response.ok) throw new Error("HF API Error");

        const data = await response.json();
        let text = data[0]?.generated_text || "";
        
        const topIdMatch = text.match(/"top_id"\s*:\s*"([^"]+)"/) || [null, null];
        const bottomIdMatch = text.match(/"bottom_id"\s*:\s*"([^"]+)"/) || [null, null];
        const shoeIdMatch = text.match(/"shoe_id"\s*:\s*"([^"]+)"/) || [null, null];

        let topId = topIdMatch[1];
        let bottomId = bottomIdMatch[1];
        let shoeId = shoeIdMatch[1];

        if (!topId || !bottomId || !shoeId) {
            const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
            const uuids = [...text.matchAll(uuidRegex)].map(m => m[0]);
            
            for (const uuid of uuids) {
                const item = available.find(i => i.id === uuid);
                if (item) {
                    if (['formal shirts', 'casual shirts', 'tshirts'].includes(item.category) && !topId) topId = item.id;
                    if (['formal pants', 'jeans', 'cargo jeans'].includes(item.category) && !bottomId) bottomId = item.id;
                    if (item.category === 'shoes' && !shoeId) shoeId = item.id;
                }
            }
        }

        const reasoningMatch = text.match(/"reasoning"\s*:\s*"([^"]+)"/);
        const reasoning = reasoningMatch ? reasoningMatch[1] : "A classic, cohesive combination perfect for the day.";

        if (!topId || !bottomId || !shoeId) throw new Error("Missing IDs");

        return {
            top: available.find(i => i.id === topId) || null,
            bottom: available.find(i => i.id === bottomId) || null,
            shoe: available.find(i => i.id === shoeId) || null,
            jacket: available.find(i => i.id === (text.match(/"jacket_id"\s*:\s*"([^"]+)"/)?.[1])) || null,
            belt: available.find(i => i.id === (text.match(/"belt_id"\s*:\s*"([^"]+)"/)?.[1])) || null,
            reasoning: reasoning
        };
    } catch (error) {
        console.error("Detailed Error:", error);
        const tops = available.filter(i => ['formal shirts', 'casual shirts', 'tshirts'].includes(i.category));
        const bottoms = available.filter(i => ['formal pants', 'jeans', 'cargo jeans'].includes(i.category));
        const shoes = available.filter(i => i.category === 'shoes');
        
        return {
            top: tops[Math.floor(Math.random() * tops.length)] || null,
            bottom: bottoms[Math.floor(Math.random() * bottoms.length)] || null,
            shoe: shoes[Math.floor(Math.random() * shoes.length)] || null,
            jacket: null,
            belt: null,
            reasoning: "The AI is thinking too hard, so here is a classic fallback combination that always works!"
        };
    }
}
