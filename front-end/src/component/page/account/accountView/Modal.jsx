import React from 'react';
import { Link } from 'react-router-dom';
import '../../../../resource/css/account/accountView/Modal.css'; // 모달 스타일을 위한 CSS 파일

const Modal = ({ show, onClose, account }) => {
  if (!show) {
    return null; // 모달을 열지 않은 상태에서는 아무것도 렌더링하지 않음
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <ul className="modal-links">
          {/* 계좌 타입에 따라 다른 항목 표시 */}
          {account.type === '대출' ? (
            <>
              {/* 대출 이자 조회 */}
              <li>
                <Link to={`/loan/${account.number}/interest`}>
                  대출 이자 조회
                </Link>
              </li>
              
              {/* 대출 중도 상환 */}
              <li>
                <Link to={`/loan/${account.number}/repayment`}>
                  대출 중도 상환
                </Link>
              </li>
            </>
          ) : (
            <>
              {/* 계좌 비밀번호 변경 */}
              <li>
                <Link 
                  to={`/account/${account.number}/password-check?purpose=password-change&accountNumber=${account.number}`}
                >
                  계좌 비밀번호 변경
                </Link>
              </li>

              {/* 이체 한도 조회 */}
              <li>
                <Link 
                  to={`/account/${account.number}/password-check?purpose=limit-inquiry&accountNumber=${account.number}`}
                >
                  이체 한도 조회
                </Link>
              </li>

              {/* 계좌 해지 */}
              <li>
                <Link 
                  to={`/account/${account.number}/password-check?purpose=close-account&accountNumber=${account.number}`}
                >
                  계좌 해지
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* 닫기 버튼 */}
        <button className="close-button" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default Modal;
