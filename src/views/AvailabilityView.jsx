import { CheckCircle2, Circle } from 'lucide-react';

export function AvailabilityView({ items, toggleAvailability }) {
    // Group items by category for easier finding
    const grouped = items.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {});

    return (
        <div className="container" style={{ paddingBottom: '100px' }}>
            <div className="app-header">
                <h1 className="editorial-title app-title">Availability</h1>
                <p className="app-subtitle">What's clean today?</p>
            </div>

            {Object.entries(grouped).map(([category, catItems]) => (
                <div key={category} style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem', textTransform: 'capitalize', borderBottom: '1px solid var(--accent-color)', paddingBottom: '0.5rem' }}>
                        {category}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {catItems.map(item => (
                            <div 
                                key={item.id} 
                                className="card" 
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    padding: '0.75rem 1rem',
                                    cursor: 'pointer',
                                    opacity: item.isAvailable ? 1 : 0.6
                                }}
                                onClick={() => toggleAvailability(item.id)}
                            >
                                <div style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    borderRadius: '4px', 
                                    overflow: 'hidden',
                                    marginRight: '1rem',
                                    backgroundColor: 'var(--accent-color)'
                                }}>
                                    {item.image && <img src={item.image} alt="" style={{width:'100%', height:'100%', objectFit:'cover'}} />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 500 }}>{item.color} {item.category}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.pattern} • {item.material}</div>
                                </div>
                                <div>
                                    {item.isAvailable ? (
                                        <CheckCircle2 color="var(--success-color)" />
                                    ) : (
                                        <Circle color="var(--text-secondary)" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            
            {items.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    Your wardrobe is empty. Add clothes first.
                </div>
            )}
        </div>
    );
}
