const accessKey = 'XF6uo4ti8HKHBahhabojeET_d7L1o61Jxm_4IMdYTr4';
const randomImageUrl = `https://api.unsplash.com/photos/random?client_id=${accessKey}`;

const randomImage = document.getElementById('random-image');
const photographer = document.getElementById('photographer');
const descriptionElement = document.getElementById('description');
const viewsElement = document.getElementById('views');
const likeButton = document.getElementById('like-button');
const likeCounter = document.getElementById('like-counter');
const nextButton = document.getElementById('next-button');
const historyList = document.getElementById('history-list');
const pagination = document.getElementById('pagination');

let currentImageId = '';
let likes = {};
let currentPage = 1;
const itemsPerPage = 10;

document.addEventListener('DOMContentLoaded', async () => {
    await loadImage();
    await loadLikes();
    await loadHistory();
});

async function loadImage() {
    try {
        const response = await fetch(randomImageUrl);
        const data = await response.json();
        const imageUrl = data.urls.regular;
        const photographerName = data.user.name;
        const description = data.description || 'Описание отсутствует или недоступно';
        const views = data.views;
        currentImageId = data.id;

        randomImage.src = imageUrl;
        photographer.textContent = photographerName;
        descriptionElement.textContent = description;
        viewsElement.textContent = views;
        updateLikeCounter();
        await addToHistory(imageUrl, photographerName);
    } catch (error) {
        console.error('Произошла ошибка:', error);
    }
}

function updateLikeCounter() {
    const count = likes[currentImageId] || 0;
    likeCounter.textContent = count;
    likeButton.textContent = count ? 'Не нравится' : 'Нравится';
}

async function loadLikes() {
    const storedLikes = localStorage.getItem('likes');
    if (storedLikes) {
        likes = JSON.parse(storedLikes);
    }
}

async function saveLikes() {
    localStorage.setItem('likes', JSON.stringify(likes));
}

async function loadHistory() {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    displayHistory(history, currentPage);
    createPagination(history.length);
}

async function addToHistory(url, photographer) {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    history.unshift({ url, photographer });
    localStorage.setItem('history', JSON.stringify(history));
    displayHistory(history, currentPage);
    createPagination(history.length);
}

function displayHistory(history, page) {
    historyList.innerHTML = '';
    const start = (page - 1) * itemsPerPage;
    const end = page * itemsPerPage;
    const paginatedItems = history.slice(start, end);

    paginatedItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.photographer}: ${item.url}`;
        historyList.appendChild(li);
    });
}

function createPagination(totalItems) {
    pagination.innerHTML = '';
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        if (i === currentPage) {
            button.disabled = true;
        }
        button.addEventListener('click', async () => {
            currentPage = i;
            await loadHistory();
        });
        pagination.appendChild(button);
    }
}

likeButton.addEventListener('click', async () => {
    if (likes[currentImageId]) {
        delete likes[currentImageId];
    } else {
        likes[currentImageId] = 1;
    }
    updateLikeCounter();
    await saveLikes();
});

nextButton.addEventListener('click', async () => {
    await loadImage();
});
