import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../../ApiService'; // ApiService 가져오기
import '../../../../resource/css/product/DepositJoinForm.css';

const ReceivedPaidMainJoin = () => {
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

  // 사용자 휴대폰 번호 가져오기
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      ApiService.getUserPhoneNumber(token)
        .then((phone) => {
          setFormData((prev) => ({ ...prev, hp: phone })); // 휴대폰 번호 설정
        })
        .catch((error) => {
          console.error('휴대폰 번호를 불러오는 중 오류 발생:', error);
        });
    }
  }, []);

  // 금액에 천 단위 콤마를 추가하는 함수
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // 금액 변경 함수 (누적 추가 가능)
  const handleAmountChange = (addedAmount) => {
    const currentAmount = formData.amount ? parseInt(formData.amount.replace(/,/g, '')) : 0;
    const newAmount = currentAmount + parseInt(addedAmount);
    setFormData({ ...formData, amount: formatNumber(newAmount.toString()) });
  };

  // 사용자가 직접 금액 입력할 때 호출
  const handleAmountInputChange = (e) => {
    const inputAmount = e.target.value.replace(/,/g, '');
    if (!isNaN(inputAmount)) {
      setFormData({ ...formData, amount: formatNumber(inputAmount) });
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
    if (!/^\d{10,11}$/.test(formData.hp)) {
      alert("유효한 휴대폰 번호를 입력해주세요. (10~11자리 숫자)");
      return;
    }

    try {
      const response = await ApiService.checkHp(formData.hp);
      setHpAuthKey(response.data); // 서버로부터 받은 인증번호 저장
      alert("인증번호가 발송되었습니다.");
    } catch (error) {
      console.error("인증번호 요청 실패:", error);
      alert("인증번호 요청 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 인증번호 확인 로직
  const handleAuthKeyCheck = () => {
    if (!enteredAuthKey) {
      alert("인증번호를 입력해주세요.");
      return;
    }
    if (String(hpAuthKey).trim() === String(enteredAuthKey).trim()) {
      setAuthSuccess(true);
      alert('휴대폰 인증이 완료되었습니다.');
    } else {
      setAuthSuccess(false);
      alert('인증번호가 일치하지 않습니다.');
    }
  };

  const goToDepositJoinFinish = async () => {
    const token = localStorage.getItem('token'); // JWT 토큰 가져오기

    // 입력 필드 유효성 검사
    if (!authSuccess) {
      alert("휴대폰 인증을 완료해주세요.");
      return;
    }

    if (!formData.password || formData.password.length !== 4) {
      alert("4자리 비밀번호를 입력해주세요.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!token) {
      alert('로그인이 필요합니다. 다시 로그인해 주세요.');
      navigate('/login'); // 로그인 페이지로 리다이렉트
      return;
    }

    // 백엔드에 보낼 데이터 준비
    const depositJoinData = {
      depositNo: depositData?.depositNo?.toString() ?? "", // 세션에 저장된 예금 상품 번호
      depositPW: formData.password, // 입력된 비밀번호, String 그대로 전송
      depositAccountNumber: depositAccountNumber
    };

    if (!depositJoinData.depositNo) {
      alert("올바른 예금 상품 정보를 찾을 수 없습니다. 다시 시도해주세요.");
      return;
    }

    try {
      // ApiService를 이용해 데이터 전송
      const response = await ApiService.savingsReceive(depositJoinData, token);
      console.log('입출금상품 가입 성공:', response.data);
      navigate('/DepositJoinFinish');
    } catch (error) {
      console.error('입출금상품 가입 실패:', error);
      alert('입출금상품 가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const goToDepositList = () => {
    navigate('/DepositList');
  };

  if (!depositData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="deposit-form-container">
      <h2>정보입력</h2>
      {/* 핸드폰 인증 */}
      <div className="form-group">
        <label>휴대폰 번호</label>
        <input
          type="tel"
          name="hp"
          value={formData.hp}
          readOnly // 수정 불가 설정
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

export default ReceivedPaidMainJoin;
