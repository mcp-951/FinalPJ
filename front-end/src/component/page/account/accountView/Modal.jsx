import React from 'react';
import { Link } from 'react-router-dom';
import '../../../../resource/css/account/accountView/Modal.css';

const Modal = ({ show, onClose, account }) => {
  if (!show) {
    return null; // 모달을 열지 않은 상태에서는 아무것도 렌더링하지 않음
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <ul className="modal-links">
          {/* 계좌 비밀번호 변경 */}
          <li>
            <Link
              to={`/account/${account.accountNumber}/password-check`}
              state={{ purpose: 'password-change', accountNumber: account.accountNumber, productName: account.depositName }}
            >
              계좌 비밀번호 변경
            </Link>
          </li>

          {/* 이체 한도 조회 */}
          <li>
            <Link
              to={`/account/${account.accountNumber}/password-check`}
              state={{ purpose: 'limit-inquiry', accountNumber: account.accountNumber, productName: account.depositName }}
            >
              이체 한도 조회
            </Link>
          </li>

          {/* 계좌 해지 */}
          <li>
            <Link
              to={`/account/${account.accountNumber}/password-check`}
              state={{ purpose: 'close-account', accountNumber: account.accountNumber, productName: account.depositName }}
            >
              계좌 해지
            </Link>
          </li>
        </ul>

        <button className="close-button" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default Modal;
