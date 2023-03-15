//------1. MOVE ICON BURGER----------------------//

const burger = document.querySelector('.burger');

function moveIcon() {
    burger.classList.toggle('open');
}
burger.addEventListener('click', moveIcon);


//------2. SHOW MOBILE-MENU-----------//

const mobileMenu = document.querySelector('.mobile-menu');

function moveMobileMenu() {
    mobileMenu.classList.toggle('open-menu')
}
burger.addEventListener('click', moveMobileMenu);

//------3. BLACKOUT----------------//

let burgerIndicator = true;

const blackout = document.querySelector('.blackout');
const logoTitle = document.querySelector('.logo-title');
const logoSubtitle = document.querySelector('.logo-subtitle');

function manageOverflowBody() {
    if (burgerIndicator) {
        document.body.style.overflowY = 'hidden';
        burgerIndicator = false;
    } else {
        burgerIndicator = true;
        document.body.style.overflowY = 'auto';
    }
}

function coverBlackout() {
    blackout.classList.toggle('active');
    document.body.style.overflowY = manageOverflowBody();
    logoTitle.classList.toggle('active');
    logoSubtitle.classList.toggle('active');
}
burger.addEventListener('click', coverBlackout);
blackout.addEventListener('click', () => {
    moveIcon(); 
    moveMobileMenu();
    coverBlackout();
});

//------4. CLOSE MOBILE-MENU via menu items---//

const linksBurger = document.querySelectorAll('.links__burger');
linksBurger.forEach(link => link.addEventListener('click', () => {
    moveIcon(); 
    moveMobileMenu();
    coverBlackout();
}));

//------5. PAGINATION and CAROUSEL-------//

let pets = [];
let fullPets = [];
let currentPage = 1;

const cardsArea = document.querySelector(".cards-content");
const numberPage = document.querySelector("#numberPage");
const startPageButton = document.querySelector("#startPage");
const lastPageButton = document.querySelector("#lastPage");
const prevPageButton = document.querySelector("#prevPage");
const nextPageButton = document.querySelector("#nextPage");
const wrapperCards = document.querySelector('.wrapper-cards');
const cardHeight = 435;
const cardMargin = 30;
let pageCount = getPageCount();

const createPets = (petsList) => {
    cardsArea.innerHTML += createElements(petsList);
}

const createElements = (petsList) => {
    let str = '';
    for (let i = 0; i < petsList.length; i++) {
        str += `<div class="card-item" data-id="${petsList[i].name}">
                    <img src="${petsList[i].img}" alt="${petsList[i].name}" class="slide__img">
                    <p class="capture">${petsList[i].name}</p>
                    <button class="button-secondary" data-id="${petsList[i].name}">Learn more</button>
                </div>`;
    }
    return str;
}

const sortLarge = (list) => {
    let uniqueLargeList = [];
    let length = list.length;
    for (let i = 0; i < (length / 8); i++) {
        const uniqueItem = [];
        for (let j = 0; j < list.length; j++) {
            if (uniqueItem.length >= 8) {
                break;
            }
            const isUnique = !uniqueItem.some((item) => {
                return item.name === list[j].name;
            });
            if (isUnique) {
                uniqueItem.push(list[j]);
                list.splice(j, 1);
                j--;
            }
        }
        uniqueLargeList = [...uniqueLargeList, ...uniqueItem];
    }
    list = uniqueLargeList;
    list = sortMedium(list);
    return list;
}

const sortMedium = (list) => {
    
    for (let i = 0; i < (list.length / 6); i++) {
        const listItem = list.slice(i * 6, (i * 6) + 6);

        for (let j = 0; j < 6; j++) {
            const duplicatedItem = listItem.find((item, index) => {
                return item.name === listItem[j].name && (index !== j);
            });
            if (duplicatedItem !== undefined) {
                const index = (i * 6) + j;
                const largeSet = Math.trunc(index / 8);
                list.splice(largeSet * 8, 0, list.splice(index, 1)[0]);
                sortMedium(list);
            }
        }
    }
    return list;
}

fetch('./pets.json').then(res => res.json()).then(list => {
    pets = list;
    fullPets = (() => {
        let tempArr = [];

        for (let i = 0; i < 6; i++) {
            const newPets = pets;
            for (let j = pets.length; j > 0; j--) {
                let index = Math.floor(Math.random() * j);
                const item = newPets.splice(index, 1)[0];
                newPets.push(item);
            }
            tempArr = [...tempArr, ...newPets];
        }
        return tempArr;
    })();

    fullPets = sortLarge(fullPets);
    createPets(fullPets);
    numberPage.innerText = currentPage;
    
    resizeWrapperCards(48 / pageCount);
    setActiveButtons();
    let cardItems = document.getElementsByClassName('card-item');
    addEventListenerCards(cardItems);
})

function resizeWrapperCards(countCards) {
    let rows = 2;
    if (countCards === 6 || countCards === 3) {
        rows = 3;
    }
    wrapperCards.style.height = `${(cardHeight + cardMargin) * rows}px`
}

function getPageCount() {
    if (window.innerWidth >= 1280 ) {
        return 6
    } else if (window.innerWidth >= 768 ) {
        return 8;
    } else {
        return 16;
    }
}

function setActiveButtons() {
    const isLastPage = currentPage === pageCount;
    const isFirstPage = currentPage === 1;

    if (isLastPage) {
        nextPageButton.setAttribute('disabled', 'true');
        lastPageButton.setAttribute('disabled', 'true');
    } else {
        nextPageButton.removeAttribute('disabled');
        lastPageButton.removeAttribute('disabled');
    }

    if (isFirstPage) {
        prevPageButton.setAttribute('disabled', 'true');
        startPageButton.setAttribute('disabled', 'true');
    } else {
        prevPageButton.removeAttribute('disabled');
        startPageButton.removeAttribute('disabled');
    }
}

function changeSize() {
    currentPage = 1;
    setActiveButtons();
    pageCount = getPageCount();
    resizeWrapperCards(fullPets.length / pageCount);
    setScroll();
}

function getScrollOffset () {
    let multiply = pageCount === 6 ? 2 : 3;
    return ((cardHeight + cardMargin) * multiply) * (currentPage - 1)
}

function setScroll() {
    cardsArea.style.top = `-${getScrollOffset()}px`;
    numberPage.innerText = currentPage;
}

prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        setActiveButtons();
        setScroll();
    }
});
nextPageButton.addEventListener('click', () => {
    if (currentPage < pageCount) {
        currentPage++;
        setActiveButtons();
        setScroll();
    }
});

startPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage = 1;
        setActiveButtons();
        setScroll();
    }
});

lastPageButton.addEventListener('click', () => {
    if (currentPage < pageCount) {
        currentPage = pageCount;
        setActiveButtons();
        setScroll();
    }
});

window.addEventListener('resize', changeSize);

//------7. POPUP-------------//

const popup = document.getElementById('popup');

function openPopup(e) {
    let pet = e.currentTarget.getElementsByClassName('button-secondary')[0].dataset.id;
    let petName = pet;
    return fullPets.filter(item => item.name === petName)[0];
}

function createPopupElements(pet) {
    return `<div class="modal-window">
                <div class="modal-close-button"></div>
                <img src="${pet.img}" alt="${pet.name}" class="modal-image">
                <div class="modal-content">
                    <h4 class="modal-title">${pet.name}</h4>
                    <p class="modal-subtitle">${pet.type} - ${pet.breed}</p>
                    <p class="modal-description">${pet.description}</p>
                    <ul class="modal-list">
                        <li class="modal-list__item"><span>Age:</span> ${pet.age}</li>
                        <li class="modal-list__item"><span>Inoculations:</span> ${pet.inoculations}</li>
                        <li class="modal-list__item"><span>Diseases:</span> ${pet.diseases}</li>
                        <li class="modal-list__item"><span>Parasites:</span> ${pet.parasites}</li>
                    </ul>
                </div>
            </div>`
}

function addEventListenerCards(cardItems) {
    [].forEach.call(cardItems, item => {
        item.addEventListener('click', (e) => {
            document.body.style.overflowY = 'hidden';
            popup.innerHTML = createPopupElements(openPopup(e));
            popup.style.display = 'flex';
            const modalCloseButton = document.getElementsByClassName('modal-close-button')[0];
            const modalWindow = document.getElementsByClassName('modal-window')[0];
            modalWindow.addEventListener('click', (e) => {
                e.stopPropagation();
            });
            popup.addEventListener('click', () => {
                popup.style.display = 'none';
                document.body.style.overflowY = 'auto';
                modalCloseButton.classList.add('modal-hover-button');
            });
            modalCloseButton.addEventListener('click', () => {
                popup.style.display = 'none';
                document.body.style.overflowY = 'auto';
            });
        })
    });
}