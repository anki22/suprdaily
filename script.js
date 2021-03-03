
let cardListData = {};

function addNewList(data, index) {
    let parent = document.querySelector('.list-wrapper');
    let title = data.title ? {value: data.title} : document.querySelector('.list-title');
    let list = document.querySelectorAll('.list');
    let count = index ? index : list.length ? parseInt(list[list.length - 1].getAttribute('data-count')) + 1 : 0;
    if(title.value) {
        let element =  `<div class="list list-${count}"  data-count="${count}">
        <div class="list-header">
            <span>${title.value}</span>
            <span class="close" data-count="${count}" onclick="removeList(event)">X</span>
        </div>
        <div class="list-content list-content-${count}"  ondrop="drop(event)" ondragover="allowDrop(event)" ondragenter="allowDrop(event)"></div>
        <div class="add-icon add-${count}" data-count="${count}">+</div>
    </div>`;
    parent.innerHTML += element;
    if(!data.title) {
        cardListData[count] = {
            title: title.value,
            count: count,
            card: {}
        }
        title.value = '';
    }
        
    }
    
    closeListPopup();
    setCardData();
}

function removeList(event) {
    let count = event.target.getAttribute('data-count');
    let el = document.querySelector(`.list-${count}`);
    delete cardListData[count];
    el.remove();
    setCardData();
}

function allowDrop(ev) {
    ev.dataTransfer.effectAllowed = "move";

    ev.preventDefault();
  }
  
  function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }
  
  function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    console.log('data', data)
    if(ev.target.classList.contains('list-content')) {

    ev.target.insertAdjacentElement('afterbegin',document.getElementById(data));
    } else {
        let el = ev.target.closest('.list-content');
        el.insertAdjacentElement('afterbegin',document.getElementById(data));
    }
  }
function newListPopup() {
    let listPopup = document.querySelector('.list-popup')
    listPopup.classList.remove('hide');
}

function closeListPopup() {
    let listPopup = document.querySelector('.list-popup')
    listPopup.classList.add('hide');
}

function addCardClick(e) {
    if(e.target.classList.contains('add-icon')) {
        onCardClick(e.target.getAttribute('data-count'))
    }
}

function onCardClick(index) { 
    openCardPopup(index)
}
function openCardPopup(index) {
    let cardPopup = document.querySelector('.card-popup')
    cardPopup.setAttribute('data-count', index)
    cardPopup.classList.remove('hide');
}
function closeCardPopup() {
    let cardPopup = document.querySelector('.card-popup')
    cardPopup.classList.add('hide');
}
function removeCard(e) {
    let count = e.target.getAttribute('data-count');
    let parentInd = count.split('-')[0];
    let childInd = count.split('-')[1];
    delete cardListData[parentInd].card[childInd];
    let el = document.querySelector(`#card-${count}`);
    el.remove();
    setCardData();
}

function setCardData() {
    localStorage.setItem('card', JSON.stringify(cardListData))
}
function getCardData() {
    return localStorage.getItem('card') || {}
}
function addNewCard(data, childIndex, mainIndex) {
    let index = mainIndex ? mainIndex : document.querySelector('.card-popup').getAttribute('data-count');
    let contentWrap = document.querySelector(`.list-content-${index}`);
    let title = data && data.title ? {value: data.title} : document.querySelector('.card-title');
    let desc = data && data.desc ? {value: data.desc} :  document.querySelector('.card-desc');
    let card = document.querySelectorAll(`.list-content-${index} .card`);
    let count = childIndex ? childIndex : card.length ? parseInt(card[card.length - 1].getAttribute('data-count')) + 1 : 0;
    if(title.value && desc.value) {
        let element =  `<div class="card" draggable="true" ondragstart="drag(event)" data-count="${count}" id="card-${index}-${count}">
        <h3>${title.value}
        <span data-count="${index}-${count}" onclick="removeCard(event)">x</span>
        </h3>
        <div>${desc.value}</div>
    </div>`;
    contentWrap.innerHTML += element
   if(!data.title) {
        cardListData[index].card[count] = {
            title: title.value,
            desc: desc.value,
            count: count
        }
        title.value = '';
        desc.value = '';
   }
    closeCardPopup();
    

    }
    setCardData();
}

function renderExistingCards() {
    for(let listIndex in cardListData) {
        addNewList(cardListData[listIndex], listIndex);
        for(let cardIndex in cardListData[listIndex].card) {
            addNewCard(cardListData[listIndex].card[cardIndex], cardIndex, listIndex);
        }
    }
}

function init() {
    document.querySelector('.add-list-button').addEventListener('click', newListPopup);
    document.querySelector('.form-add-list').addEventListener('click', addNewList);
    document.querySelector('.form-add-card').addEventListener('click', addNewCard);
    
    window.addEventListener('click', addCardClick)
    cardListData = JSON.parse(getCardData());
    if(cardListData) {
        renderExistingCards();
    }
}
init();