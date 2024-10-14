import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import '../../../../resource/css/account/accountManagement/PasswordCheck.css';
import axios from 'axios';

const PasswordCheck = ({ title, instructions }) => {
  const [accounts, setAccounts] = useState([]);  // 계좌 목록을 저장하는 상태
  const [selectedAccount, setSelectedAccount] = useState('');  // 선택된 계좌 번호
  const [selectedProductName, setSelectedProductName] = useState('');  // 선택된 계좌의 상품명
  const [password, setPassword] = useState('');  // 입력된 비밀번호
  const [isPasswordValid, setIsPasswordValid] = useState(null);  // 비밀번호 유효성 상태
  const [errorMessage, setErrorMessage] = useState('');  // 오류 메시지 상태

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();  // 모달에서 넘어온 state를 받기 위해 useLocation 사용

  // URL 쿼리 파라미터나 location.state에서 accountNumber 가져오기
  const purpose = searchParams.get('purpose');
  const accountNumberFromQuery = searchParams.get('accountNumber'); // URL 쿼리에서 가져오기
  const { accountNumber: accountNumberFromState, productName: productNameFromState } = location.state || {}; // 모달에서 전달된 값

  // accountNumber를 최종적으로 결정
  const accountNumber = accountNumberFromQuery || selectedAccount || accountNumberFromState;
  const productName = selectedProductName || productNameFromState || ''; // productName도 전달받은 값 사용

  // JWT 토큰과 userNo를 로컬 스토리지에서 가져오기
  const token = localStorage.getItem("token");
  const userNo = localStorage.getItem("userNo");

  // 로그인 여부 확인
  useEffect(() => {
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login'); // 로그인 페이지로 리다이렉트
    }
  }, [token, navigate]);

  // 계좌 목록을 불러오는 함수
  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/uram/users/${userNo}/accounts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });  // 계좌 목록을 불러오는 API 호출

      const { accounts } = response.data;
      setAccounts(accounts);
    } catch (error) {
      console.error("Error fetching accounts: ", error);
      setErrorMessage("계좌 목록을 불러오는 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    if (!accountNumber) {
      fetchAccounts(); // accountNumber가 없을 때만 전체 계좌 목록을 불러옴
    }
  }, [accountNumber]);

  // 계좌 선택 시 처리
  const handleAccountSelect = (event) => {
    const selectedAccountNumber = event.target.value;
    setSelectedAccount(selectedAccountNumber);

    // 선택된 계좌에 맞는 상품명 설정
    const selectedAccountData = accounts.find(account => account.accountNumber === selectedAccountNumber);
    if (selectedAccountData) {
      setSelectedProductName(selectedAccountData.depositName);  // 상품명 설정 (depositName 사용)
    }
  };

  // 비밀번호 확인 로직
  const handlePasswordCheck = async () => {
    if (password.trim() !== "") {
      try {
        const response = await axios.post(`http://localhost:8081/uram/account/${accountNumber}/check-password`, {
          userNo: userNo,  // userNo를 요청에 포함
          password: password,  // 비밀번호를 그대로 문자열로 전달
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (response.status === 200) {
          setIsPasswordValid(true);
          setErrorMessage('비밀번호가 확인되었습니다.');
        }
      } catch (error) {
        setIsPasswordValid(false);
        if (error.response && error.response.status === 401) {
          setErrorMessage('비밀번호가 올바르지 않습니다.');
        } else {
          setErrorMessage('비밀번호 확인 중 오류가 발생했습니다.');
        }
      }
    } else {
      setErrorMessage('비밀번호를 입력하세요.');
    }
  };

  // 비밀번호 확인 후 다음 페이지로 이동하는 로직
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!accountNumber) {
      alert('계좌를 선택하세요.');
      return;
    }

    if (isPasswordValid) {
      let targetUrl = "";

      if (purpose === 'password-change') {
        targetUrl = `/account/${accountNumber}/password-change`;
      } else if (purpose === 'close-account') {
        targetUrl = `/account/${accountNumber}/close`;
      } else if (purpose === 'limit-inquiry') {
        targetUrl = `/account/${accountNumber}/limit-inquiry`;
      }

      if (targetUrl) {
        navigate(targetUrl, { state: { productName, accountNumber } });
      } else {
        alert("올바른 목적이 설정되지 않았습니다.");
      }
    } else {
      alert(errorMessage);
    }
  };

  return (
    <div className="password-check-container">
      <h2>{title}</h2>
      <p>{instructions}</p>

      <div className="account-select">
        <label>계좌 선택</label>
        {accountNumber ? (
          <div>
            <p style={{ fontSize: '20px', fontWeight: 'bold' }}>
              {accountNumber} ({productName}) {/* 크고 굵은 글씨로 표시 */}
            </p>
          </div>
        ) : (
          <select value={selectedAccount} onChange={handleAccountSelect}>
            <option value="">계좌를 선택하세요</option>
            {accounts.map(account => (
              <option key={account.accountNumber} value={account.accountNumber}>
                {account.accountNumber} ({account.depositName}) {/* 드롭다운에서도 계좌번호와 계좌명을 같이 표시 */}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="password-input">
        <label>비밀번호 입력</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호 입력"
        />
        <button onClick={handlePasswordCheck} className="password-check-button">확인</button>

        <span className={`password-check-status ${isPasswordValid === false ? 'error' : isPasswordValid === true ? 'check-mark' : ''}`}>
          {errorMessage}
        </span>
      </div>

      <button onClick={handleSubmit} className="password-submit-button" disabled={!isPasswordValid}>
        확인
      </button>
    </div>
  );
};

export default PasswordCheck;
