// AI Video Generation Models Data
const models = [
    {
        id: 1,
        name: "Sora",
        description: "OpenAI's revolutionary text-to-video model that generates high-quality videos up to 60 seconds with detailed scenes and multiple characters.",
        type: "text-to-video",
        pricing: "paid",
        features: ["60s video length", "High resolution", "Complex scenes", "Multiple characters"],
        resolution: "1080p",
        maxDuration: "60s",
        url: "https://openai.com/sora"
    },
    {
        id: 2,
        name: "Runway Gen-3",
        description: "Advanced video generation model with impressive motion quality and style control. Great for creative projects and professional content.",
        type: "text-to-video",
        pricing: "hybrid",
        features: ["Motion control", "Style transfer", "Camera movements", "4K output"],
        resolution: "4K",
        maxDuration: "16s",
        url: "https://runwayml.com"
    },
    {
        id: 3,
        name: "Pika Labs",
        description: "User-friendly video generation with support for various input types including text, images, and videos. Popular for social media content.",
        type: "text-to-video",
        pricing: "hybrid",
        features: ["Image-to-video", "Video-to-video", "Text-to-video", "Social media formats"],
        resolution: "1080p",
        maxDuration: "10s",
        url: "https://pika.art"
    },
    {
        id: 4,
        name: "Luma AI Dream Machine",
        description: "Creates high-quality videos from text and images with realistic motion and physics. Known for its cinematic quality.",
        type: "text-to-video",
        pricing: "hybrid",
        features: ["Realistic physics", "Cinematic quality", "Fast generation", "Mobile app"],
        resolution: "1080p",
        maxDuration: "12s",
        url: "https://lumalabs.ai"
    },
    {
        id: 5,
        name: "Kling AI",
        description: "Chinese AI video model with impressive quality and long video generation capabilities. Supports both text and image inputs.",
        type: "text-to-video",
        pricing: "hybrid",
        features: ["Long duration", "High quality", "Multi-scene", "Chinese/English"],
        resolution: "1080p",
        maxDuration: "60s",
        url: "https://kling.ai"
    },
    {
        id: 6,
        name: "Stable Video Diffusion",
        description: "Open-source video generation model from Stability AI. Great for developers and researchers who want to run models locally.",
        type: "image-to-video",
        pricing: "free",
        features: ["Open source", "Local deployment", "Customizable", "Image animation"],
        resolution: "512x512",
        maxDuration: "25s",
        url: "https://github.com/Stability-AI/StableVideoDiffusion"
    },
    {
        id: 7,
        name: "Make-A-Video",
        description: "Meta's text-to-video model that creates videos from text descriptions. Focuses on high-quality, diverse video generation.",
        type: "text-to-video",
        pricing: "paid",
        features: ["Diverse styles", "High quality", "Research focused", "Meta AI"],
        resolution: "720p",
        maxDuration: "15s",
        url: "https://ai.meta.com"
    },
    {
        id: 8,
        name: "Gen-2 (Runway)",
        description: "The predecessor to Gen-3, still widely used for its reliability and good quality output. Great for beginners.",
        type: "text-to-video",
        pricing: "hybrid",
        features: ["Beginner friendly", "Reliable", "Style presets", "Editing tools"],
        resolution: "1080p",
        maxDuration: "8s",
        url: "https://runwayml.com"
    },
    {
        id: 9,
        name: "AnimateDiff",
        description: "Extension for Stable Diffusion that adds animation capabilities. Popular in the open-source community for custom workflows.",
        type: "image-to-video",
        pricing: "free",
        features: ["Open source", "Custom models", "Community support", "Flexible"],
        resolution: "Variable",
        maxDuration: "Variable",
        url: "https://github.com/guoyww/AnimateDiff"
    },
    {
        id: 10,
        name: "HeyGen",
        description: "AI video generator focused on creating professional videos with AI avatars and voices. Great for business and education.",
        type: "text-to-video",
        pricing: "hybrid",
        features: ["AI avatars", "Voice cloning", "Templates", "Business focused"],
        resolution: "1080p",
        maxDuration: "300s",
        url: "https://heygen.com"
    },
    {
        id: 11,
        name: "InVideo AI",
        description: "Comprehensive video creation platform with AI assistance. Combines templates, stock footage, and AI generation.",
        type: "text-to-video",
        pricing: "hybrid",
        features: ["Templates", "Stock library", "Text-to-video", "Editing suite"],
        resolution: "1080p",
        maxDuration: "180s",
        url: "https://invideo.io"
    },
    {
        id: 12,
        name: "Vidu",
        description: "ByteDance's AI video model that excels at generating high-quality videos with complex scenes and consistent characters.",
        type: "text-to-video",
        pricing: "paid",
        features: ["Complex scenes", "Character consistency", "High quality", "ByteDance"],
        resolution: "1080p",
        maxDuration: "16s",
        url: "https://vidu.com"
    }
];

// DOM Elements
const modelsGrid = document.getElementById('modelsGrid');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderModels(models);
    setupEventListeners();
});

// Render Models
function renderModels(modelsToRender) {
    modelsGrid.innerHTML = modelsToRender.map(model => `
        <div class="model-card" data-type="${model.type}" data-pricing="${model.pricing}">
            <div class="model-header">
                <h3 class="model-name">${model.name}</h3>
                <span class="model-badge badge-${model.pricing}">${getPricingLabel(model.pricing)}</span>
            </div>
            <p class="model-description">${model.description}</p>
            <div class="model-features">
                ${model.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
            </div>
            <div class="model-meta">
                <span class="meta-item">
                    <i class="fas fa-tv"></i> ${model.resolution}
                </span>
                <span class="meta-item">
                    <i class="fas fa-clock"></i> ${model.maxDuration}
                </span>
            </div>
            <a href="${model.url}" class="model-link" target="_blank">
                <i class="fas fa-external-link-alt"></i> Visit Website
            </a>
        </div>
    `).join('');
}

// Get Pricing Label
function getPricingLabel(pricing) {
    switch (pricing) {
        case 'free': return 'Free';
        case 'paid': return 'Paid';
        case 'hybrid': return 'Freemium';
        default: return 'Unknown';
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Search
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredModels = models.filter(model =>
            model.name.toLowerCase().includes(searchTerm) ||
            model.description.toLowerCase().includes(searchTerm)
        );
        renderModels(filteredModels);
    });

    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.dataset.filter;
            let filteredModels = [...models];

            if (filter !== 'all') {
                if (filter === 'free') {
                    filteredModels = models.filter(model => model.pricing === 'free' || model.pricing === 'hybrid');
                } else if (filter === 'text-to-video' || filter === 'image-to-video') {
                    filteredModels = models.filter(model => model.type === filter);
                }
            }

            renderModels(filteredModels);
        });
    });
}