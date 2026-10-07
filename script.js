// Data Configuration
const categories = ['japanese', 'european', 'american', 'african', 'latina'];
const itemsPerCategory = 100; // 100 images per set

// Helper function to generate random Unsplash images based on category
function getImageUrl(category, index) {
    // Using Unsplash Source API with specific keywords
    const keyword = category === 'japanese' ? 'japanese+model' : 
                    category === 'european' ? 'european+woman' : 
                    category === 'american' ? 'american+girl' : 
                    category === 'african' ? 'african+beauty' : 'latina+woman';
    
    return `https://source.unsplash.com/random/400x60