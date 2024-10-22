import React from 'react';
import { Link } from 'react-router-dom';
import '../../../../resource/css/account/accountView/Modal.css';

const Modal = ({ show, onClose, account }) => {
  if (!show) {
    return null; // 모달이 열리지 않았을 때는 아무것도 렌더링하지 않음
  }

  return (
    <div className="Modal-overlay">
      <div className="Modal-content">
        <ul className="Modal-links">
          {/* 계좌 비밀번호 변경 */}
          <li>
            <Link
              to={`/account/${account.accountNumber}/password-check?purpose=password-change`}
            >
              계좌 비밀번호 변경
            </Link>
          </li>

          {/* 이체 한도 조회 */}
          <li>
            <Link
              to={`/account/${account.accountNumber}/password-check?purpose=limit-inquiry`}
            >
              이체 한도 조회
            </Link>
          </li>

          {/* 계좌 해지 */}
          <li>
            <Link
              to={`/account/${account.accountNumber}/password-check?purpose=close-account`}
            >
              계좌 해지
            </Link>
          </li>
        </ul>

        <button className="Modal-close-button" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default Modal;