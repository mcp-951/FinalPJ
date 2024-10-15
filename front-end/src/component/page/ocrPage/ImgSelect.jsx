import React, { useRef, useState } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import axios from 'axios';

const ImgSelect = () => {
    const cropperRef = useRef(null);
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState(''); // 메시지를 저장할 상태 추가
  
    // 파일 선택 시 호출되는 함수
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };
  
    // 이미지 자르기 및 전송 함수
    const handleCropAndUpload = () => {
      const cropper = cropperRef.current.cropper;
      if (cropper) {
        // 잘린 이미지를 Blob으로 변환
        cropper.getCroppedCanvas().toBlob((blob) => {
          const formData = new FormData();
          formData.append('file', blob, 'ocr.png');
          
          // 백엔드로 전송
          axios.post('http://localhost:8081/ocr/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((response) => {
            console.log('Upload success:', response.data);
            setMessage(response.data); // 성공 메시지
            setImage(null); // 이미지 초기화
          })
          .catch((error) => {
            console.error('Upload error:', error);
            setMessage('Upload failed.'); // 실패 메시지
          });
        });
      }
    };
  
    return (
      <div>
        <input type="file" onChange={handleFileChange} />
        {image && (
          <Cropper
            src={image}
            style={{ height: 400, width: '100%' }}
            guides={true} // 자르기 가이드라인 표시
            ref={cropperRef}
          />
        )}
        <button onClick={handleCropAndUpload}>Crop and Upload</button>
        {message && <p>{message}</p>} {/* 메시지 표시 */}
      </div>
    );
  };

export default ImgSelect;