'use strict';

const recommendBook = document.getElementById('recommend-book');
const recommendButton = document.getElementById('recommend');
const selectElement = document.getElementById('select-book');


recommendButton.addEventListener('click', () => {
  recommendBook.classList.toggle('invalid');

  if (recommendButton.checked) {

    selectElement.disabled = false;

  } else {

    selectElement.disabled = true;
    
  }
});
