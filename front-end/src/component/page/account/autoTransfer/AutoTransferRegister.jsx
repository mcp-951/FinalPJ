import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../../resource/css/account/autoTransfer/AutoTransferRegister.css'; // 고유 스타일링을 위한 CSS 파일

const AutoTransferRegister = () => {
  const [isMandatoryChecked, setIsMandatoryChecked] = useState(false); // 필수 약관 동의 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate

  useEffect(() => {
    const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login'); // 로그인 페이지로 리다이렉트
    }
  }, [navigate]);

  const handleYesClick = () => {
    if (!isMandatoryChecked) {
      alert('필수 약관에 동의하셔야 합니다.');
      return;
    }

    // '예' 클릭 시 AutoTransferRegisterStep2로 이동하며 autoAgreement 값을 y로 전달
    navigate('/auto-transfer/step2', { state: { autoAgreement: 'Y' } });
  };

  const handleNoClick = () => {
    navigate('/'); // '아니오' 클릭 시 메인 페이지로 이동
  };

  return (
    <div className="AutoTransferRegister-container">
      <h2>자동이체 등록</h2>
      <p>자동이체를 등록하기 전, 약관을 반드시 숙지하시기 바랍니다.</p>
  
      {/* 스크롤 가능한 약관 영역 */}
      <div className="AutoTransferRegister-terms-box">
        <h4>[필수] 자동이체 약관</h4>
        <div className="AutoTransferRegister-terms-content">
          <p>
            제 1 조 (자동이체의 기능)<br />
            자동이체는 미리 정해진 일정에 따라 지정된 계좌로 자동적으로 이체하는 기능을 의미합니다.
            지정된 일자에 잔액이 부족할 경우에는 다음 영업일에 자동으로 이체가 진행됩니다.
          </p>
          <p>
            제 2 조 (자동이체 처리)<br />
            자동이체가 정상적으로 이체될 경우, 이체한 금액은 즉시 지정된 계좌로 반영됩니다.
            이체 설정을 해제한 경우에는 자동이체가 더 이상 실행되지 않습니다.
          </p>
          <p>
            제 3 조 (이체 실패 처리)<br />
            지정된 날짜에 잔액이 부족할 경우, 일정 금액의 수수료를 부과할 수 있습니다.
          </p>
          <p>
            제 4 조 (약정 변경 및 해제)<br />
            은행은 고객의 요청에 따라 자동이체 설정을 변경하거나 해제할 수 있으며, 이러한 변경은 최소 2영업일 전에 요청되어야 합니다.
          </p>
          <p>
            제 5 조 (자동이체 중단)<br />
            5개월 연속으로 자동이체가 이루어지지 않을 경우 자동이체 설정이 해제될 수 있습니다.
          </p>
          <p>
            제 6 조 (활성화된 자동이체)<br />
            자동이체는 활성화된 상태에서만 정상적으로 작동하며, 별도의 설정을 통해 비활성화할 수 있습니다.
          </p>
          <p>
            제 7 조 (잔액 부족에 대한 알림)<br />
            자동이체가 잔액 부족으로 실행되지 않을 경우 알림을 통해 공지합니다.
          </p>
          <p>
            제 8 조 (약관의 변경)<br />
            은행은 필요에 따라 약관을 변경할 수 있으며, 사전 공지를 통해 변경사항을 고객에게 알립니다.
          </p>
          <p>
            제 9 조 (기타 약정)<br />
            본 약관에 명시되지 않은 기타 사항에 대해서는 은행의 기본 약관에 따릅니다.
          </p>
        </div>
      </div>
  
      <div className="AutoTransferRegister-terms-container">
        <div className="AutoTransferRegister-term-item">
          <input
            type="checkbox"
            checked={isMandatoryChecked}
            onChange={() => setIsMandatoryChecked(!isMandatoryChecked)}
          />
          <span>위 약관에 동의합니다.</span>
        </div>
      </div>
  
      <p>위 약관의 내용을 충분히 숙지하시고 이해하셨으며, 이에 동의하십니까?</p>
  
      <div className="AutoTransferRegister-button-group">
        <button className="AutoTransferRegister-yes-button" onClick={handleYesClick}>
          예
        </button>
        <button className="AutoTransferRegister-no-button" onClick={handleNoClick}>아니오</button>
      </div>
    </div>
  );
};

// 올바르게 export 구문을 마지막에 위치시킵니다.
export default AutoTransferRegister;
