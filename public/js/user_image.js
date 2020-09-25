'use strict';

// 画像をリサイズする大きさ
const imageSize = 400;

const imgReader = new Image();
const reader = new FileReader();
const userImage = document.getElementById('user-image');
const iniSrc = userImage.src;
const file = document.getElementById('file');

file.onchange = (e) => {

    const fileData = e.target.files[0];
    const isUploaded = ! (typeof fileData === 'undefined');

    // アップロードされた場合
    if (isUploaded) {
        reader.readAsDataURL(fileData);
        
    // 一度アップロード後にもう1回ファイルを選択しようとして、キャンセルを押した場合
    // 一度もアップロードしていない場合は、onchange自体が走らない。
    } else {
        // キャンセルを押すと、Inputの中身もなくなるので、元に戻している
        userImage.src = iniSrc;
    }
};

reader.onload = () => {
    imgReader.src = reader.result;
}

// TODO: リサイズしてから送信するようにしたい
imgReader.onload = () => {
    // src = data:image/jpeg;base64,.....
    // imgType = image/jpeg
    const imgType = imgReader.src.substring(5, imgReader.src.indexOf(';'));
    const canvas = document.createElement('canvas');
    // canvas.width = imageSize;
    // canvas.height = imageSize;
    canvas.width = imgReader.width;
    canvas.height = imgReader.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imgReader, 0, 0, imgReader.width, imgReader.height);
    userImage.src = canvas.toDataURL(imgType);
}