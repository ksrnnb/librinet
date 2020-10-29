import React, { useEffect, useState } from 'react';
import { UserImage } from './UserCard';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Modal, Button } from 'react-bootstrap';
import { PropTypes } from 'prop-types';

function ModalWindow(props) {
  const show = props.show;
  const setShow = props.setShow;

  const handleClose = () => setShow(false);
  const trimming = props.trimming;

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>画像のトリミング</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">{props.children}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            キャンセルする
          </Button>
          <Button variant="primary" onClick={trimming}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default function UserImageInput(props) {
  const minSize = 150;
  const initialCrop = {
    aspect: 1,
    unit: '%',
  };

  const [crop, setCrop] = useState(initialCrop);
  const [show, setShow] = useState(false);
  const [src, setSrc] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const { image, setImage } = props;

  useEffect(() => {
    // モーダル表示中に画面のサイズを変更した場合の処理。
    window.addEventListener('resize', () => {
      const modal = document.getElementsByClassName('ReactCrop');

      if (modal[0]) {
        const height = modal[0].clientHeight;
        const width = modal[0].clientWidth;

        const max = height > width ? width : height;

        // 初期化。トリミング開始位置を左上に。サイズも最大の大きさに
        crop.x = 0;
        crop.y = 0;
        crop.maxWidth = max;
        crop.maxHeight = max;

        setCrop(crop);
      }
    });
  }, []);

  function trimming() {
    // モーダルウィンドウ中の画像の大きさを取得
    const modal = document.getElementsByClassName('ReactCrop');
    const height = modal[0].clientHeight;
    const width = modal[0].clientWidth;

    // 以下は公式通り
    // https://github.com/DominicTobias/react-image-crop
    const canvas = document.createElement('canvas');
    const scaleX = uploadedImage.naturalWidth / width;
    const scaleY = uploadedImage.naturalHeight / height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      uploadedImage,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    // src -> data:image/jpeg;base64........
    const contentType = uploadedImage.src.split(';')[0].split(':')[1];
    const trimmedSrc = canvas.toDataURL(contentType);

    setShow(false);
    setCrop(initialCrop);
    setImage(trimmedSrc);
  }

  function onChangeImage(e) {
    const reader = new FileReader();
    const file = e.target.files[0];
    // 値を初期化しないと、
    // もう一回画像をしようとしてキャンセルするとonChangeが発火するけど画像は無い、っていう状態になる。
    e.target.value = null;
    reader.readAsDataURL(file);

    reader.onload = () => {
      readImage(reader.result);
    };
  }

  function readImage(src) {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      const aspect = image.height / image.width;
      aspect > 1 ? (crop.width = minSize) : (crop.height = minSize);

      setShow(true);
      setCrop(crop);
      setSrc(src);
      setUploadedImage(image);
    };
  }

  function mySetShow(isShown) {
    setShow(isShown);

    // 閉じるときは初期化する。
    !isShown && setCrop(initialCrop);
  }

  return (
    <>
      <UserImage image={image} />
      <div className="text-center">
        <label
          htmlFor="user-image-input"
          id="user-image-label"
          className="btn btn-outline-success mt-3"
        >
          <input
            type="file"
            accept="image/jpeg,image/png"
            name="user-image-input"
            id="user-image-input"
            onChange={onChangeImage}
          />
          Upload
        </label>
      </div>

      <ModalWindow show={show} setShow={mySetShow} trimming={trimming}>
        <ReactCrop
          src={src}
          crop={crop}
          keepSelection={true}
          minWidth={minSize}
          minHeight={minSize}
          onChange={(newCrop) => setCrop(newCrop)}
        />
      </ModalWindow>
    </>
  );
}

UserImageInput.propTypes = {
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  setImage: PropTypes.func,
};

ModalWindow.propTypes = {
  show: PropTypes.bool,
  setShow: PropTypes.func,
  trimming: PropTypes.func,
  children: PropTypes.element,
};
