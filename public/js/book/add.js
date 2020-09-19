'use strict';

const genreContainer = document.getElementById('genre-container');
const selectGenre = document.getElementsByTagName('select')[0];

const newRadioButton = document.getElementById('new');
const convRadioButton = document.getElementById('conventional');
const newInput = document.getElementById('new-input');
const submitButton = document.getElementById('submit-button');

const canSelectGenre = Boolean(convRadioButton);

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