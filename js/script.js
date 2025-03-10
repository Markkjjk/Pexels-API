const API_KEY = '49255185-b30234024a2367670b46fa60e';
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const imageGallery = document.getElementById('imageGallery');
const favoritesGallery = document.getElementById('favoritesGallery');
const clearButton = document.getElementById('clearButton');

// Função para buscar imagens na Pixabay API (GET)
async function fetchImages(query) {
    const url = `https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=photo&per_page=15`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erro ao buscar imagens');
        }
        const data = await response.json();
        return data.hits;
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao buscar imagens. Verifique o console para mais detalhes.');
        return [];
    }
}

function displayImages(images) {
    imageGallery.innerHTML = '';
    if (images.length === 0) {
        imageGallery.innerHTML = '<p>Nenhuma imagem encontrada.</p>';
        return;
    }
    images.forEach((image) => {
        const imgElement = document.createElement('img');
        imgElement.src = image.webformatURL;
        imgElement.alt = image.tags || 'Imagem sem descrição';
        imgElement.addEventListener('click', () => saveFavorite(image));
        imageGallery.appendChild(imgElement);
    });
}

// Função para salvar imagem favorita no localStorage (POST implícito)
function saveFavorite(image) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.push(image);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
    alert('Imagem salva como favorita!');
}

function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favoritesGallery.innerHTML = '';
    if (favorites.length === 0) {
        favoritesGallery.innerHTML = '<p>Nenhuma imagem favorita.</p>';
        return;
    }
    favorites.forEach((image, index) => {
        const imgElement = document.createElement('img');
        imgElement.src = image.webformatURL;
        imgElement.alt = image.tags || 'Imagem sem descrição';
        imgElement.addEventListener('dblclick', () => removeFavorite(index));
        favoritesGallery.appendChild(imgElement);
    });
}

// Função para remover imagem favorita (DELETE implícito)
function removeFavorite(index) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.splice(index, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
    alert('Imagem removida dos favoritos!');
}

// Função para limpar todos os favoritos (DELETE implícito)
function clearFavorites() {
    localStorage.removeItem('favorites');
    displayFavorites();
    alert('Todas as imagens foram removidas!');
}

searchButton.addEventListener('click', async () => {
    const query = searchInput.value;
    if (query) {
        const images = await fetchImages(query);
        displayImages(images);
    } else {
        alert('Por favor, insira uma palavra-chave para buscar.');
    }
});

clearButton.addEventListener('click', clearFavorites);

displayFavorites();