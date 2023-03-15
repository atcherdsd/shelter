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

//------5. SLIDER--------------//

const btnNavigation = document.querySelectorAll('.btn__navigation');
const imageItems = document.querySelectorAll('.image-item');
const imageCaptures = document.querySelectorAll('.capture');
const cardItems = document.querySelectorAll('.card-item');
const btnSecondary = document.querySelectorAll('.button-secondary');

let digits = [PETS[4], PETS[0], PETS[2]];
function changeImage(event) {
    
    let set = new Set();
    while (set.size < 3) {

        let randomDigit = Math.floor(Math.random() * 8);
        if (!digits.includes(PETS[randomDigit]))
            set.add(PETS[randomDigit]);
    }
    digits = Array.from(set);

    if (event.target.classList.contains('btn__navigation')) {
        imageItems.forEach((img, i) => {
            img.src = digits[i].img;
            img.alt = digits[i].name;
        });
        imageCaptures.forEach((val, i) => {
            val.textContent = digits[i].name;
        });
        cardItems.forEach((ident, i) => {
            ident.dataset.id = digits[i].name;
        });
        btnSecondary.forEach((ident, i) => {
            ident.dataset.id = digits[i].name;
        });
    }
}
btnNavigation.forEach(btn => btn.addEventListener('click', changeImage));


//-----6. CAROUSEL----------//

const carousel = document.querySelector('.slider-wrapper');
const btnNavigationLeft = document.querySelector('.btn-arrow__left');
const btnNavigationRight = document.querySelector('.btn-arrow__right'); 

function moveToLeft() {
    carousel.classList.add('transition-left');
    if (carousel.classList.contains('transition-right'))
        carousel.classList.remove('transition-right')
}

function moveToRight() {
    carousel.classList.add('transition-right');
    if (carousel.classList.contains('transition-left'))
        carousel.classList.remove('transition-left')
}

function deleteClassSlider() {
    carousel.classList.remove('transition-right');
    carousel.classList.remove('transition-left');
}

btnNavigationLeft.addEventListener('click', () => {
    moveToLeft();
    setTimeout(deleteClassSlider, 500);
});
btnNavigationRight.addEventListener('click', () => {
    moveToRight();
    setTimeout(deleteClassSlider, 500);
});

//------7. POPUP-------------//

const popup = document.getElementById('popup');

function openPopup(e) {
    let pet = e.currentTarget.getElementsByClassName('button-secondary')[0].dataset.id;
    let petName = pet;
    return PETS.filter(item => item.name === petName)[0];
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
            })
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
addEventListenerCards(cardItems);