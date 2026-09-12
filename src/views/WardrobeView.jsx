import { useState, useRef } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';

const CATEGORIES = [
    'formal pants', 'formal shirts', 'casual shirts', 'tshirts', 
    'jeans', 'cargo jeans', 'jackets', 'shoes', 'belts'
];

export function WardrobeView({ items, addItem, removeItem }) {
    const [isAdding, setIsAdding] = useState(false);
    
    // Form state
    const [image, setImage] = useState(null);
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [color, setColor] = useState('');
    const [pattern, setPattern] = useState('');
    const [material, setMaterial] = useState('');
    const [description, setDescription] = useState('');
    
    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addItem({
            image,
            category,
            color,
            pattern,
            material,
            description
        });
        
        // Reset form
        setImage(null);
        setCategory(CATEGORIES[0]);
        setColor('');
        setPattern('');
        setMaterial('');
        setDescription('');
        setIsAdding(false);
    };

    return (
        <div className="container" style={{ paddingBottom: '100px' }}>
            <div className="app-header">
                <h1 className="editorial-title app-title">Wardrobe</h1>
                <p className="app-subtitle">Your Collection</p>
            </div>

            {!isAdding && (
                <div style={{ textAlign: 'center', marginBottom: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button className="btn-primary" onClick={() => setIsAdding(true)}>
                        + Add New Item
                    </button>
                </div>
            )}

            {isAdding && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Photo</label>
                            <div 
                                className="image-upload-preview" 
                                onClick={() => fileInputRef.current.click()}
                            >
                                {image ? (
                                    <img src={image} alt="Preview" />
                                ) : (
                                    <>
                                        <ImagePlus size={32} style={{ marginBottom: '8px' }} />
                                        <span>Tap to upload photo</span>
                                    </>
                                )}
                            </div>
                            <input 
                                type="file" 
                                accept="image/*" 
                                ref={fileInputRef} 
                                style={{ display: 'none' }} 
                                onChange={handleImageUpload}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select 
                                className="input-field" 
                                value={category} 
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Color</label>
                            <input 
                                type="text" 
                                className="input-field" 
                                placeholder="e.g. Navy Blue" 
                                value={color} 
                                onChange={(e) => setColor(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Pattern</label>
                            <input 
                                type="text" 
                                className="input-field" 
                                placeholder="e.g. Solid, Striped, Plaid" 
                                value={pattern} 
                                onChange={(e) => setPattern(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Material</label>
                            <input 
                                type="text" 
                                className="input-field" 
                                placeholder="e.g. Cotton, Denim" 
                                value={material} 
                                onChange={(e) => setMaterial(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description (Optional)</label>
                            <textarea 
                                className="input-field" 
                                placeholder="e.g. Favorite summer shirt" 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button type="button" className="btn-secondary" onClick={() => setIsAdding(false)}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-primary">
                                Save Item
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="clothes-grid">
                {items.map(item => (
                    <div key={item.id} className="clothes-item">
                        <div className="clothes-img-container">
                            {item.image ? (
                                <img src={item.image} alt={item.color} />
                            ) : (
                                <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#999'}}>
                                    No Image
                                </div>
                            )}
                            <button 
                                onClick={() => removeItem(item.id)}
                                style={{
                                    position: 'absolute', 
                                    top: '8px', 
                                    right: '8px', 
                                    background: 'rgba(255,255,255,0.8)', 
                                    borderRadius: '50%',
                                    padding: '4px',
                                    color: 'var(--error-color)'
                                }}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <div className="clothes-info">
                            <div className="clothes-title">{item.color} {item.category}</div>
                            <div className="clothes-meta">{item.pattern} • {item.material}</div>
                        </div>
                    </div>
                ))}
                {items.length === 0 && !isAdding && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                        Your wardrobe is empty. Add some clothes!
                    </div>
                )}
            </div>
        </div>
    );
}
