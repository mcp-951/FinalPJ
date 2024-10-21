import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../../ApiService'; // ApiService 가져오기
import '../../../../resource/css/product/DepositJoinForm.css';

const DepositJoin = () => {
  const navigate = useNavigate();
  const [depositData, setDepositData] = useState(null);
  const [formData, setFormData] = useState({
    period: '',
    amount: '',
    accountNumber: '',
    password: '',
    confirmPassword: '', // 비밀번호 확인 필드 추가
    autoTransferDate: '', // 자동이체일 추가
    hp: '', // 핸드폰 번호 추가
  });

  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [availableBalance, setAvailableBalance] = useState(null);
  const [errorMessages, setErrorMessages] = useState({});
  const [passwordError, setPasswordError] = useState('');
  const [depositAccountNumber, setDepositAccountNumber] = useState(''); 
  const [hpAuthKey, setHpAuthKey] = useState(''); // 인증번호 저장
  const [enteredAuthKey, setEnteredAuthKey] = useState(''); // 입력한 인증번호
  const [authSuccess, setAuthSuccess] = useState(false); // 인증 완료 여부

  useEffect(() => {
    const token = localStorage.getItem('token');
    // 토큰이 없으면 로그인 페이지로 리다이렉트
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [navigate]);

  
  useEffect(() => {
    const storedDeposit = sessionStorage.getItem('selectedDeposit');
    if (storedDeposit) {
      const parsedDepositData = JSON.parse(storedDeposit);
      setDepositData(parsedDepositData);
    }
  }, []);

  // 적금 계좌번호 생성 함수
  const generateDepositAccountNumber = () => {
    const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString(); 
    return `${randomNumber.slice(0, 3)}-01-${randomNumber.slice(2, 7)}`; 
  };

  // 적금 계좌번호를 페이지 로드 시 한 번 생성
  useEffect(() => {
    const depositAccountNumber = generateDepositAccountNumber();
    setDepositAccountNumber(depositAccountNumber);
  }, []);

  // 유저의 핸드폰 번호 가져오기
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      ApiService.getUserPhoneNumber(token)
        .then((phone) => {
          setFormData((prevData) => ({
            ...prevData,
            hp: phone,
          }));
        })
        .catch((error) => {
          console.error('핸드폰 번호 정보를 불러오는 중 오류 발생:', error);
        });
    }
  }, []);

  // 금액에 천 단위 콤마를 추가하는 함수
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // 금액 변경 함수 (유효성 검사 추가)
  const handleAmountChange = (addedAmount) => {
    const currentAmount = formData.amount ? parseInt(formData.amount.replace(/,/g, '')) : 0;
    const newAmount = currentAmount + parseInt(addedAmount);
    const minAmount = depositData.depositMinimumAmount;
    const maxAmount = depositData.depositMaximumAmount;

    if (newAmount < minAmount) {
      alert(`가입 금액은 최소 ${minAmount * 0.0001}만원 이상이어야 합니다.`);
      return;
    }

    if (newAmount > maxAmount) {
      alert(`가입 금액은 최대 ${maxAmount * 0.0001}만원 이하이어야 합니다.`);
      return;
    }

    setFormData({ ...formData, amount: formatNumber(newAmount.toString()) });
  };

  // 사용자가 직접 금액 입력할 때 호출
  const handleAmountInputChange = (e) => {
    const inputAmount = e.target.value.replace(/,/g, '');
    if (!isNaN(inputAmount)) {
      setFormData({ ...formData, amount: formatNumber(inputAmount) });
    }
  };

  const handleAmountBlur = () => {
    const amountInWon = parseFloat(formData.amount.replace(/[^0-9]/g, ''));
    const minAmount = depositData.depositMinimumAmount;
    const maxAmount = depositData.depositMaximumAmount;

    if (!formData.amount) {
      alert("가입 금액을 입력해주세요.");
      return;
    }

    if (amountInWon < minAmount || amountInWon > maxAmount) {
      alert(`가입 금액은 최소 ${minAmount * 0.0001}만원 ~ 최대 ${maxAmount * 0.0001}만원까지 가능합니다.`);
      setFormData({ ...formData, amount: '' });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 비밀번호 확인 로직
  const handlePasswordCheck = () => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('비밀번호가 일치하지 않습니다.');
    } else {
      setPasswordError('비밀번호가 일치합니다.');
    }
  };

  // 핸드폰 인증번호 요청 함수
  const handleHpVerification = async () => {
    try {
      const response = await ApiService.checkHp(formData.hp);
      setHpAuthKey(response.data); // 서버로부터 받은 인증번호 저장
      alert("인증번호가 발송되었습니다.");
    } catch (error) {
      console.error("인증번호 요청 실패:", error);
      alert("인증번호 요청 중 오류가 발생했습니다.");
    }
  };

  // 인증번호 확인 로직
  const handleAuthKeyCheck = () => {
    if (String(hpAuthKey).trim() === String(enteredAuthKey).trim()) {
      setAuthSuccess(true);
      alert('휴대폰 인증이 완료되었습니다.');
    } else {
      setAuthSuccess(false);
      alert('인증번호가 일치하지 않습니다.');
    }
  };

  // 가입 기간 유효성 검사
  const handlePeriodBlur = () => {
    const { period } = formData;
    if (period < depositData.depositMinimumDate || period > depositData.depositMaximumDate) {
      alert(`가입 기간은 최소 ${depositData.depositMinimumDate}개월에서 최대 ${depositData.depositMaximumDate}개월까지 가능합니다.`);
      setFormData({ ...formData, period: '' });
    }
  };

  // 가입 기간 변경 함수 (유효성 검사 추가)
  const handlePeriodChange = (newPeriod) => {
    const minPeriod = depositData.depositMinimumDate;
    const maxPeriod = depositData.depositMaximumDate;

    if (newPeriod < minPeriod) {
      alert(`가입 기간은 최소 ${minPeriod}개월 이상이어야 합니다.`);
      return;
    }

    if (newPeriod > maxPeriod) {
      alert(`가입 기간은 최대 ${maxPeriod}개월 이하이어야 합니다.`);
      return;
    }

    setFormData({ ...formData, period: newPeriod });
  };

  const goToDepositJoinFinish = async () => {
    const token = localStorage.getItem('token'); // JWT 토큰 가져오기

    if (!token) {
      alert('로그인이 필요합니다. 다시 로그인해 주세요.');
      navigate('/login');
      return;
    }
    const selectedAccountObj = accounts.find(account => account.accountNumber === selectedAccount);
    if (!selectedAccountObj) {
      alert('계좌를 선택해주세요.');
      return;
    }
    const depositJoinData = {
      accountNo: selectedAccountObj.accountNo.toString(), 
      depositNo: depositData.depositNo.toString(),
      depositBalance: parseInt(formData.amount.replace(/,/g, '')),
      depositPeriod: parseInt(formData.period),
      depositPW: formData.password,
      depositTransferDay: formData.autoTransferDate,
      depositAccountNumber: depositAccountNumber
    };

    try {
      const response = await ApiService.savingsJoin(depositJoinData, token);
      console.log('예금상품 가입 성공:', response.data);
      navigate('/DepositJoinFinish');
    } catch (error) {
      console.error('예금상품 가입 실패:', error);
      alert('예금상품 가입 중 오류가 발생했습니다.');
    }
  };

  const goToDepositList = () => {
    navigate('/DepositList');
  };

  // 계좌 정보 가져오기
  useEffect(() => {
    ApiService.getUserAccounts()
      .then((response) => {
        const filteredAccounts = response.data.filter(account => {
          return account.deposit && account.deposit.depositName && account.deposit.depositName.includes('입출금');
        });
        setAccounts(filteredAccounts);
      })
      .catch((error) => {
        console.error('계좌 정보를 불러오는 중 오류 발생:', error);
        setErrorMessages({ ...errorMessages, fetchError: '계좌 정보를 불러오는 중 오류가 발생했습니다.' });
      });
  }, []);

  const handleCheckBalance = () => {
    const selectedAcc = accounts.find(account => account.accountNumber === selectedAccount);
    if (selectedAcc && selectedAcc.accountBalance !== undefined) {
      setAvailableBalance(selectedAcc.accountBalance);
    } else {
      setAvailableBalance(null);
      setErrorMessages({ ...errorMessages, selectedAccount: '계좌를 선택해주세요.' });
    }
  };

  if (!depositData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="deposit-form-container">
      <h2>정보입력</h2>
      {/* 가입기간 */}
      <div className="form-group">
        <label>가입기간</label>
        <div className="period-container">
          <input
            type="number"
            name="period"
            value={formData.period}
            onChange={(e) => setFormData({ ...formData, period: e.target.value })}
            onBlur={handlePeriodBlur}
            placeholder={'가입기간을 입력해주세요'}
          />개월
          <div className="period-options">
            {depositData.depositMinimumDate <= 6 && (
              <button onClick={() => handlePeriodChange(6)}>6개월</button>
            )}
            {depositData.depositMinimumDate <= 12 && (
              <button onClick={() => handlePeriodChange(12)}>12개월</button>
            )}
            {depositData.depositMaximumDate >= 24 && (
              <button onClick={() => handlePeriodChange(24)}>24개월</button>
            )}
            {depositData.depositMaximumDate >= 36 && (
              <button onClick={() => handlePeriodChange(36)}>36개월</button>
            )}
            {depositData.depositMaximumDate >= 48 && (
              <button onClick={() => handlePeriodChange(48)}>48개월</button>
            )}
            {depositData.depositMaximumDate >= 60 && (
              <button onClick={() => handlePeriodChange(60)}>60개월</button>
            )}
          </div>
        </div>
        <div className="date-display">최소 {depositData.depositMinimumDate}개월 ~ 최대 {depositData.depositMaximumDate}개월</div>
      </div>

      {/* 가입금액 */}
      <div className="form-group">
        <label>가입금액</label>
        <div className="amount-container">
          <input
            type="text"
            name="amount"
            value={formData.amount}
            onChange={handleAmountInputChange}
            onBlur={handleAmountBlur}
            placeholder={`가입금액을 입력해주세요`}
          />
          <span>최소 {depositData.depositMinimumAmount * 0.0001} 만원이상</span>

          <div className="amount-options">
            <button onClick={() => handleAmountChange(1000000)}>100만</button>
            <button onClick={() => handleAmountChange(3000000)}>300만</button>
            <button onClick={() => handleAmountChange(5000000)}>500만</button>
            <button onClick={() => handleAmountChange(10000000)}>1000만</button>
          </div>
        </div>
        <div className="date-display">최소 {depositData.depositMinimumAmount * 0.0001}만원 ~ 최대 {depositData.depositMaximumAmount * 0.0001}만원</div>
      </div>

      {/* 출금계좌번호 */}
      <div className="form-group">
        <label>출금계좌번호</label>
        <div className="auto-transfer-step2-balance-section">
          <select
            value={selectedAccount}
            onChange={(e) => {
              setSelectedAccount(e.target.value);
              setAvailableBalance(null);
              setErrorMessages({ ...errorMessages, selectedAccount: '' });
            }}
          >
            <option value="">계좌 선택</option>
            {accounts.map(account => (
              <option key={account.accountNo} value={account.accountNumber}>
                {account.accountNumber} - {account.deposit.depositName}
              </option>
            ))}
          </select>
          <button type="button" onClick={handleCheckBalance} className="auto-transfer-step2-balance-button">
            출금가능금액
          </button>
          {availableBalance !== null ? (
            <span className="auto-transfer-step2-balance-info">{availableBalance?.toLocaleString()}원</span>
          ) : (
            <span className="auto-transfer-step2-error-message">{errorMessages.selectedAccount}</span>
          )}
        </div>
      </div>

      {/* 핸드폰 인증 */}
      <div className="form-group">
        <label>휴대폰 번호</label>
        <input
          type="tel"
          name="hp"
          value={formData.hp} // 가져온 핸드폰 번호 설정
          onChange={handleChange}
          readOnly
        />
        <button type="button" onClick={handleHpVerification} className="verify-button">
          인증번호 받기
        </button>
      </div>

      <div className="form-group">
        <label>인증번호</label>
        <input
          type="text"
          name="enteredAuthKey"
          value={enteredAuthKey}
          onChange={(e) => setEnteredAuthKey(e.target.value)}
          placeholder="인증번호 입력"
        />
        <button type="button" onClick={handleAuthKeyCheck} className="verify-button">
          인증하기
        </button>
        {authSuccess && <span className="success-message">✔ 인증 완료</span>}
      </div>

      {/* 비밀번호 입력 */}
      <div className="form-group">
        <label>비밀번호 입력 (4자리)</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          maxLength="4"
          onChange={handleChange}
        />
      </div>

      {/* 비밀번호 확인 입력 */}
      <div className="form-group">
        <label>비밀번호 확인</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          maxLength="4"
          onChange={handleChange}
        />
        <button type="button" onClick={handlePasswordCheck}>확인</button>
        <span className="password-error">{passwordError}</span>
      </div>
      {/* 버튼 */}
      <div className="form-buttons">
        <button type="button" onClick={goToDepositList}>취소</button>
        <button type="button" onClick={goToDepositJoinFinish}>완료</button>
      </div>
    </div>
  );
};

export default DepositJoin;
