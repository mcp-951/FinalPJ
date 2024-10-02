import React from 'react';
import '../../../../resource/css/account/autoTransfer/TermsModal.css'; // 고유 스타일링을 위한 CSS 파일

const TermsModal = ({ show, onClose, content }) => {
  if (!show) return null;

  return (
    <div className="terms-modal-overlay">
      <div className="terms-modal-content">
        <p>{content}</p>
        <button onClick={onClose} className="terms-close-button">닫기</button>
      </div>
    </div>
  );
};

export default TermsModal;
