import React from 'react';
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

export default class UserImageInput extends React.Component {
  constructor(props) {
    super(props);

    // props.setStateImage();
    this.state = {
      src: null,
      show: false,
      crop: {
        aspect: 1,
        unit: '%',
      },
    };

    this.onChangeImage = this.onChangeImage.bind(this);
    this.setCrop = this.setCrop.bind(this);
    this.setShow = this.setShow.bind(this);
    this.readImage = this.readImage.bind(this);
    this.resize = this.resize.bind(this);
    this.trimming = this.trimming.bind(this);
  }

  trimming() {
    this.setShow(false);
    const crop = this.state.crop;
    const image = this.resizedImage;

    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    const contentType = image.src.split(';')[0].split(':')[1];
    const trimmedSrc = canvas.toDataURL(contentType);

    // TODO: 閉じるときに、アニメーションになる時とならないときがある。bootstrap側の問題？
    this.setShow(false);
    this.props.setImage(trimmedSrc);
  }

  onChangeImage(e) {
    const reader = new FileReader();
    const file = e.target.files[0];
    // 値を初期化しないと、
    // もう一回画像をしようとしてキャンセルするとonChangeが発火するけど画像は無い、っていう状態になる。
    e.target.value = null;
    reader.readAsDataURL(file);

    reader.onload = () => {
      this.readImage(reader.result);
    };
  }

  resize(image) {
    const modalWidth = 300;

    if (image.width > modalWidth) {
      const scale = modalWidth / image.width;
      image.width = modalWidth;
      image.height = image.height * scale;
    }

    this.resizedImage = image;

    return image;
  }

  readImage(src) {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      const aspect = image.height / image.width;
      const crop = this.state.crop;

      if (aspect > 1) {
        crop.width = 100;
      } else {
        crop.height = 100;
      }

      // Canvasを利用して、リサイズしたImageをBase64形式にする。
      const resizedImage = this.resize(image);

      const canvas = document.createElement('canvas');
      canvas.width = this.resizedImage.width;
      canvas.height = this.resizedImage.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        resizedImage,
        0,
        0,
        resizedImage.width,
        resizedImage.height
      );

      // src -> data:image/jpeg;base64........
      const contentType = src.split(';')[0].split(':')[1];
      const resizedSrc = canvas.toDataURL(contentType);
      // ctx.clearRect(0, 0, resizedImage.width, resizedImage.height);

      this.setState({
        src: resizedSrc,
        crop: crop,
        show: true,
      });
    };
  }

  setShow(isShown) {
    this.setState({
      show: isShown,
    });

    // 閉じるときは初期化する。
    if (!isShown) {
      const crop = {
        aspect: 1,
        unit: '%',
      };

      this.setCrop(crop);
    }
  }

  setCrop(newCrop) {
    this.setState({
      crop: newCrop,
    });
  }

  render() {
    const image = this.props.image;
    const src = this.state.src;
    const crop = this.state.crop;
    const show = this.state.show;
    return (
      <>
        <UserImage image={image} />
        <label htmlFor="user-image">
          <input
            type="file"
            accept="image/jpeg,image/png"
            name="user-image"
            id="user-image"
            onChange={this.onChangeImage}
          />
        </label>
        <p>(jpeg or png)</p>

        <ModalWindow
          show={show}
          setShow={this.setShow}
          trimming={this.trimming}
        >
          <ReactCrop
            src={src}
            crop={crop}
            keepSelection={true}
            onChange={(newCrop) => this.setCrop(newCrop)}
          />
        </ModalWindow>
      </>
    );
  }
}

UserImageInput.propTypes = {
  image: PropTypes.string,
  setImage: PropTypes.func,
};

ModalWindow.propTypes = {
  show: PropTypes.bool,
  setShow: PropTypes.func,
  trimming: PropTypes.func,
  children: PropTypes.element,
};
