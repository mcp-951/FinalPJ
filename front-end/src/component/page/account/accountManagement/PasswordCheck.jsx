import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../../../resource/css/account/accountManagement/PasswordCheck.css';
import axios from 'axios';

const PasswordCheck = ({ title, instructions }) => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedProductName, setSelectedProductName] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isPasswordDisabled, setIsPasswordDisabled] = useState(false); // 비밀번호 입력 비활성화 상태

  const navigate = useNavigate();
  const location = useLocation();

  // location.state에서 값 가져오기
  const { purpose: initialPurpose, accountNumber: accountNumberFromState, productName: productNameFromState } = location.state || {};
  
  // 계좌번호와 목적을 상태로 관리
  const [purpose, setPurpose] = useState(initialPurpose);
  const accountNumber = selectedAccount || accountNumberFromState;
  const productName = selectedProductName || productNameFromState || ''; // productName도 전달받은 값 사용

  const token = localStorage.getItem("token");
  const userNo = localStorage.getItem("userNo");

  useEffect(() => {
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [token, navigate]);

  // 계좌 목록을 불러오는 함수
  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/uram/accounts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const { accounts } = response.data;
      if (!accounts || accounts.length === 0) {
        alert('등록된 계좌가 없습니다.');
        navigate('/');
      } else {
        setAccounts(accounts || []);
      }
    } catch (error) {
      console.error("Error fetching accounts: ", error);
      setErrorMessage("계좌 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!accountNumber) {
      fetchAccounts();
    } else {
      setLoading(false);
    }
  }, [accountNumber]);

  // 계좌 선택 시 처리, 선택한 계좌의 목적과 상품명도 설정
  const handleAccountSelect = (event) => {
    const selectedAccountNumber = event.target.value;
    setSelectedAccount(selectedAccountNumber);

    const selectedAccountData = accounts.find(account => account.accountNumber === selectedAccountNumber);
    if (selectedAccountData) {
      setSelectedProductName(selectedAccountData.depositName);
    }
  };

  const handlePasswordCheck = async () => {
    if (password.trim() !== "") {
      try {
        const response = await axios.post(`http://localhost:8081/uram/account/${accountNumber}/check-password`, {
          userNo: userNo,
          password: password,
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setIsPasswordValid(true);
          setErrorMessage('비밀번호가 확인되었습니다.');
          setIsPasswordDisabled(true); // 비밀번호 확인 후 입력 비활성화
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // 비밀번호 유효성 여부 확인
    if (!isPasswordValid) {
      setErrorMessage('비밀번호를 인증하세요.');
      return;
    }

    let targetUrl = "";

    if (purpose === 'password-change') {
      targetUrl = `/account/${accountNumber}/password-change`;
    } else if (purpose === 'close-account') {
      targetUrl = `/account/${accountNumber}/close`;
    } else if (purpose === 'limit-inquiry') {
      targetUrl = `/account/${accountNumber}/limit-inquiry`;
    }

    if (targetUrl) {
      navigate(targetUrl, { state: { productName, accountNumber, purpose } }); // purpose를 포함해 전달
    } else {
      alert("올바른 목적이 설정되지 않았습니다.");
    }
  };

  if (loading) {
    return <p>로딩 중...</p>;
  }

  return (
    <div className="password-check-container">
      <h2>{title}</h2>
      <p>{instructions}</p>

      {/* 계좌 선택 창 */}
      {!accountNumber ? (
        <div className="account-select">
          <label>계좌 선택</label>
          <select value={selectedAccount || ''} onChange={handleAccountSelect}>
            <option value="">계좌를 선택하세요</option>
            {accounts.map(account => (
              <option key={account.accountNumber} value={account.accountNumber}>
                {account.accountNumber} ({account.depositName})
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p>선택된 계좌: {accountNumber} ({productName})</p>
      )}

      <div className="password-input">
        <label>비밀번호 입력</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호 입력"
          disabled={isPasswordDisabled} // 비밀번호 입력 비활성화
        />
        <button
          onClick={handlePasswordCheck}
          className="password-check-button"
          disabled={isPasswordDisabled} // 비밀번호 확인 후 버튼 비활성화
        >
          확인
        </button>

        <span className={`password-check-status ${isPasswordValid === false ? 'error' : isPasswordValid === true ? 'check-mark' : ''}`}>
          {errorMessage}
        </span>
      </div>

      <button onClick={handleSubmit} className="password-submit-button">
        확인
      </button>
    </div>
  );
};

export default PasswordCheck;
