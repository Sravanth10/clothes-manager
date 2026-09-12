export async function generateAvatarImage(outfit) {
    // Build a description of the outfit for the prompt
    let outfitDesc = [];
    if (outfit.top) outfitDesc.push(`a ${outfit.top.color} ${outfit.top.pattern || ''} ${outfit.top.category}`);
    if (outfit.jacket) outfitDesc.push(`with a ${outfit.jacket.color} ${outfit.jacket.category}`);
    if (outfit.bottom) outfitDesc.push(`and ${outfit.bottom.color} ${outfit.bottom.category}`);
    if (outfit.shoe) outfitDesc.push(`wearing ${outfit.shoe.color} ${outfit.shoe.category}`);
    
    const clothingText = outfitDesc.join(', ');

    // The prompt enforces the style of the uploaded cartoon image
    const prompt = `A cute, cartoonish young male character with glasses and brown hair, full body standing perfectly straight facing forward, hands in pockets. He is wearing ${clothingText}. 2D vector art style, flat colors, clean UI asset, solid white background, high quality, symmetrical.`;

    try {
        const hfKey = import.meta.env.VITE_HF_API_KEY;
        if (!hfKey) return { error: "Missing HF API key." };

        const response = await fetch('/hf-api/models/black-forest-labs/FLUX.1-schnell', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${hfKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ inputs: prompt })
        });
        
        if (!response.ok) {
            return { error: "Failed to load avatar image from Hugging Face." };
        }
        
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        
        return { imageUrl };
    } catch (e) {
        console.error("Avatar generation error:", e);
        return { error: "Network error generating avatar." };
    }
}
