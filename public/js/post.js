'use strict';

const addBook = document.getElementById('add-book');
const genreContainer = document.getElementById('genre-container');
const selectGenre = document.getElementsByTagName('select')[0];

const newRadioButton = document.getElementById('new');
const convRadioButton = document.getElementById('conventional');
const newInput = document.getElementById('new-input');
const submitButton = document.getElementById('submit-button');

const canSelectGenre = Boolean(convRadioButton);

// 本棚に追加ボタンが有効
if (addBook.value == 1) {

  newInput.required = true;
  
  addBook.addEventListener('click', (e) => {

    // 本棚に追加ボタンがチェックされているとき
    if (e.target.checked) {
      genreContainer.classList.remove('invalid');
      newRadioButton.disabled = false;
      newInput.disabled = false;
      if (newRadioButton.checked) {
        newInput.required = true;
      }

      if (canSelectGenre) {
        convRadioButton.disabled = false;
      }

    // チェックが外れているとき
    } else {
      genreContainer.classList.add('invalid');
      newRadioButton.disabled = true;
      newInput.disabled = true;
      newInput.required = false;

      if (canSelectGenre) {
        convRadioButton.disabled = true;
        selectGenre.disabled = true;
      }
    }
  });

  // 新しいジャンルを入力、チェックしたとき
  newRadioButton.addEventListener('click', () => {
    newInput.disabled = false;
    newInput.required = true;
    
    if (canSelectGenre) {
      selectGenre.disabled = true;
    }
  });

  // 本の登録がない場合はnull
  if (canSelectGenre) {
    // 既存のジャンルを入力、チェックしたとき
    convRadioButton.addEventListener('click', () => {
      selectGenre.disabled = false;
      newInput.disabled = true;
      newInput.required = false;
    });
  }

// 本棚に追加ボタンが無効
} else {
  // ジャンルを追加する領域を表示しない
  genreContainer.classList.add('d-none');
}