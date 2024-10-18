import React, { useRef, useState } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import axios from 'axios';

const ImgSelect = () => {
    const cropperRef = useRef(null);
    const [image, setImage] = useState(null);
    const [ocrName, setOcrName] = useState('');
    const [ocrLocalNo, setOcrLocalNo] = useState('');
  
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
            const splitLines = response.data.split('\n');
            console.log(splitLines + '자른값');
            if (splitLines.length >= 2) { // 최소 2줄이 있는 경우
              setOcrName(splitLines[0]); // 첫 번째 줄을 ocrName에 저장
              setOcrLocalNo(splitLines[1]); // 두 번째 줄을 ocrLocalNo에 저장
            }
            setImage(null); // 이미지 초기화
          })
          .catch((error) => {
            console.error('Upload error:', error);
          });
        });
      }
    };

    const dataForwarding = () => {
      if(!ocrName || !ocrLocalNo){
        alert("올바른 사진을 넣어주세요.");
      }
      else{
        const resultMessage = {
          value1: ocrName, // 첫 번째 값
          value2: ocrLocalNo  // 두 번째 값
        };
        window.opener.postMessage(resultMessage, 'http://localhost:3000'); // 부모 창에 메시지 전송
        window.close();
      }
    }
  
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
        {ocrName && <p>이름 : {ocrName}, 주민번호 : {ocrLocalNo}</p>}

        <button onClick={dataForwarding}>보내기</button>
      </div>
    );
  };

export default ImgSelect;