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
  const location = useLocation(); // URL 쿼리 파라미터 가져오기
  const query = new URLSearchParams(location.search); // 쿼리 파라미터 파싱
  const purpose = query.get('purpose'); // purpose 값 추출
  
  const token = localStorage.getItem("token");
  const userNo = localStorage.getItem("userNo");

  // 계좌번호와 상품명을 상태로 관리
  const [accountNumber, setAccountNumber] = useState('');
  const [productName, setProductName] = useState('');

  useEffect(() => {
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [token, navigate]);

  // 계좌 목록을 불러오는 함수
  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`http://13.125.114.85:8081/uram/accounts`, {
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
    fetchAccounts();
  }, []);

  // 계좌 선택 시 처리
  const handleAccountSelect = (event) => {
    const selectedAccountNumber = event.target.value;
    setAccountNumber(selectedAccountNumber);

    const selectedAccountData = accounts.find(account => account.accountNumber === selectedAccountNumber);
    if (selectedAccountData) {
      setProductName(selectedAccountData.depositName);
    }
  };

  const handlePasswordCheck = async () => {
    if (password.trim() !== "") {
      try {
        const response = await axios.post(`http://13.125.114.85:8081/uram/account/${accountNumber}/check-password`, {
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
      navigate(targetUrl, { state: { productName, accountNumber } });
    } else {
      alert("올바른 목적이 설정되지 않았습니다.");
    }
  };

  if (loading) {
    return <p>로딩 중...</p>;
  }

  return (
    <div className="PasswordCheck-container">
      <h2>{title}</h2>
      <p>{instructions}</p>
  
      {/* 계좌 선택 창 */}
      <div className="PasswordCheck-account-select">
        <label>계좌 선택</label>
        <select value={accountNumber} onChange={handleAccountSelect}>
          <option value="">계좌를 선택하세요</option>
          {accounts.map(account => (
            <option key={account.accountNumber} value={account.accountNumber} disabled={isPasswordValid}>
              {account.accountNumber} ({account.depositName})
            </option>
          ))}
        </select>
      </div>
  
      <div className="PasswordCheck-password-input">
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
          className="PasswordCheck-password-check-button"
          disabled={isPasswordDisabled} // 비밀번호 확인 후 버튼 비활성화
        >
          비밀번호 확인
        </button>
  
        <span className={`PasswordCheck-password-check-status ${isPasswordValid === false ? 'error' : isPasswordValid === true ? 'check-mark' : ''}`}>
          {errorMessage}
        </span>
      </div>
  
      <button onClick={handleSubmit} className="PasswordCheck-password-submit-button">
        확인
      </button>
    </div>
  );
};

// export 구문은 파일의 마지막에 위치해야 합니다.
export default PasswordCheck;
