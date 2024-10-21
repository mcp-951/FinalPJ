import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // useLocation 추가
import '../../../../resource/css/account/autoTransfer/AutoTransferRegister.css'; // 고유 스타일링을 위한 CSS 파일

const AutoTransferRegister = () => {
  const [isMandatoryChecked, setIsMandatoryChecked] = useState(false); // 필수 약관 동의 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate
  const location = useLocation(); // 전달된 state를 가져오기 위해 useLocation 사용
  const { depositCategory = 1 } = location.state || {}; // 기본값 설정

  useEffect(() => {
    const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login'); // 로그인 페이지로 리다이렉트
    }

    // 전달된 depositCategory 값을 콘솔로 확인
    console.log("Received depositCategory:", depositCategory);
  }, [navigate, depositCategory]); 

  const handleYesClick = () => {
    if (!isMandatoryChecked) {
      alert('필수 약관에 동의하셔야 합니다.');
      return;
    }

    // depositCategory에 따라 다른 페이지로 이동
    if (depositCategory === 1) {
      navigate('/DepositJoin', { state: { autoAgreement: 'Y' } });
    } else if (depositCategory === 2) {
      navigate('/SavingsJoin', { state: { autoAgreement: 'Y' } });
    } else {
      console.error('올바르지 않은 depositCategory 값:', depositCategory);
      alert('올바르지 않은 카테고리입니다.');
    }
  };

  const handleNoClick = () => {
    navigate('/'); // '아니오' 클릭 시 메인 페이지로 이동
  };

  return (
    <div className="auto-transfer-register-container-unique">
      {/* 스크롤 가능한 약관 영역 */}
      <h4>[필수] 상품가입 약관</h4>
      <div className="terms-box-unique">
        <div className="terms-content-unique">
          <p>
            제 1 조 (목적)<br />
            이 약관은 고객이 당행에서 제공하는 예금, 적금, 대출 상품에 가입함에 있어, 해당 금융 상품 이용에 관한 기본적인 사항을 규정함을 목적으로 합니다.
          </p>
          <p>
            제 2 조 (용어의 정의)<br />
            1. "상품"이라 함은 당행에서 제공하는 예금, 적금, 대출 등의 금융 서비스를 말합니다.<br />
            2. "고객"이라 함은 이 약관에 따라 상품을 이용하기 위해 가입 신청을 한 자를 말합니다.
          </p>
          <p>
            제 3 조 (상품 가입 및 계약 체결)<br />
            1. 고객은 상품의 내용을 충분히 이해한 후, 본 약관에 동의하고 가입 신청서를 제출함으로써 상품에 가입할 수 있습니다.<br />
            2. 상품 가입은 당행의 심사를 거쳐 승인될 수 있으며, 심사 기준에 따라 가입이 거절될 수 있습니다.
          </p>
          <p>
            제 4 조 (이자, 수수료 및 상환 조건)<br />
            1. 예금 및 적금 상품의 이자율은 가입 시 안내된 조건에 따르며, 당행은 시장 상황에 따라 이자율을 변경할 수 있습니다.<br />
            2. 대출 상품의 이자율, 수수료, 상환 기간 및 방법은 계약 시 설정된 조건에 따르며, 당행의 정책에 따라 조정될 수 있습니다.<br />
            3. 대출 상환의 지연 또는 연체 시 추가 수수료 및 법적 조치가 발생할 수 있습니다.
          </p>
          <p>
            제 5 조 (상품 해지 및 중도 해지)<br />
            1. 예금 및 적금 상품의 해지 시 해당 상품의 약관에 따라 이자 및 수수료가 적용됩니다. 중도 해지 시 별도의 수수료가 부과될 수 있습니다.<br />
            2. 대출 상품의 중도 상환 및 조기 상환 시 발생할 수 있는 수수료는 계약 시 설정된 조건에 따릅니다.
          </p>
          <p>
            제 6 조 (개인정보의 수집 및 이용)<br />
            1. 당행은 상품 가입 및 서비스 제공을 위해 필요한 최소한의 개인정보를 수집하며, 이를 안전하게 관리합니다.<br />
            2. 수집된 개인정보는 상품의 제공 및 관리 목적 외에는 사용되지 않으며, 고객의 동의 없이 제3자에게 제공되지 않습니다.
          </p>
          <p>
            제 7 조 (책임과 면책)<br />
            1. 당행은 고객의 본 약관 위반, 고의 또는 과실로 인한 손해에 대해 책임을 지지 않습니다.<br />
            2. 천재지변, 전쟁, 테러 등 불가항력적인 사유로 인해 상품 제공이 어려울 경우 당행은 이에 대한 책임을 면할 수 있습니다.
          </p>
          <p>
            제 8 조 (약관의 변경)<br />
            1. 당행은 사전 고지 후 본 약관을 변경할 수 있으며, 변경된 약관은 당행의 웹사이트 또는 공지사항을 통해 확인할 수 있습니다.<br />
            2. 고객은 변경된 약관에 동의하지 않을 경우, 상품 해지를 요청할 수 있습니다.
          </p>
          <p>본 약관은 2024년 10월 17일부터 시행됩니다.</p>
        </div>
      </div>
      <h4>[필수] 자동이체 약관</h4>
      <div className="terms-box-unique">
        <p>자동이체를 등록하기 전, 약관을 반드시 숙지하시기 바랍니다.</p>
        <div className="terms-content-unique">
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
      <div className="terms-container-unique">
        <div className="term-item-unique">
          <input
            type="checkbox"
            checked={isMandatoryChecked}
            onChange={() => setIsMandatoryChecked(!isMandatoryChecked)}
          />
          <span>위 약관에 동의합니다.</span>
        </div>
      </div>

      <p>위 약관의 내용을 충분히 숙지하시고 이해하셨으며, 이에 동의하십니까?</p>

      <div className="button-group-unique">
        <button className="yes-button-unique" onClick={handleYesClick}>
          예
        </button>
        <button className="no-button-unique" onClick={handleNoClick}>아니오</button>
      </div>
    </div>
  );
};

export default AutoTransferRegister;
