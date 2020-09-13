'use strict';

const bookForm = document.getElementById('book-form');
const searchButton = document.getElementById('search-button');


searchButton.addEventListener('click', () => {

  
  // TODO: validation
  const isbn = document.getElementById('isbn').value;
  bookForm.action += '/' + isbn;
  bookForm.submit();


  // console.log(bookForm.action + '/' + isbn);
});