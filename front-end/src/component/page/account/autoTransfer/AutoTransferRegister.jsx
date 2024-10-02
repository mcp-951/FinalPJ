import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TermsModal from './TermsModal'; // 모달 컴포넌트를 약관 모달로 변경
import '../../../../resource/css/account/autoTransfer/AutoTransferRegister.css'; // 고유 스타일링을 위한 CSS 파일

const AutoTransferRegister = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [isMandatoryChecked, setIsMandatoryChecked] = useState(false); // 필수 약관 동의 상태
  const [isOptionalChecked, setIsOptionalChecked] = useState(false); // 선택 약관 동의 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate

  const handleViewDetails = (type) => {
    if (type === 'full') {
      setModalContent('전체 약관 상세 내용입니다.');
    } else if (type === 'mandatory') {
      setModalContent('필수 약관 상세 내용입니다.');
    } else if (type === 'optional') {
      setModalContent('선택 약관 상세 내용입니다.');
    }
    setShowModal(true); // 모달 창 열기
  };

  const handleYesClick = () => {
    if (!isMandatoryChecked) {
      alert('필수 약관에 동의하셔야 합니다.');
      return;
    }
    navigate('/auto-transfer-step2'); // '예' 클릭 시 AutoTransferRegisterStep2로 이동
  };

  const handleNoClick = () => {
    navigate('/'); // '아니오' 클릭 시 메인 페이지로 이동
  };

  return (
    <div className="auto-transfer-register-container-unique">
      <h2>자동이체 등록</h2>
      <p>자동이체를 등록하기 전, 약관을 반드시 숙지하시기 바랍니다.</p>

      <div className="terms-container-unique">
        <div className="term-item-unique">
          <input
            type="checkbox"
            checked={isMandatoryChecked}
            onChange={() => setIsMandatoryChecked(!isMandatoryChecked)}
          />
          <span>[필수] 자동이체 약관</span>
          <button className="arrow-button-unique" onClick={() => handleViewDetails('mandatory')}>
            &#9654;
          </button>
        </div>
        <div className="term-item-unique">
          <input
            type="checkbox"
            checked={isOptionalChecked}
            onChange={() => setIsOptionalChecked(!isOptionalChecked)}
          />
          <span>[선택] 자동이체 약관</span>
          <button className="arrow-button-unique" onClick={() => handleViewDetails('optional')}>
            &#9654;
          </button>
        </div>
      </div>

      <p>위 약관의 내용을 충분히 숙지하시고 이해하셨으며, 이에 동의하십니까?</p>

      <div className="button-group-unique">
        <button className="yes-button-unique" onClick={handleYesClick}>
          예
        </button>
        <button className="no-button-unique" onClick={handleNoClick}>아니오</button>
      </div>

      {/* TermsModal 컴포넌트 */}
      <TermsModal show={showModal} onClose={() => setShowModal(false)} content={modalContent} />
    </div>
  );
};

export default AutoTransferRegister;
