import React from 'react';
import '../../../../resource/css/admin/AdminLogin.css';

const AdminLogin = () => {
  return (
    <div className='loginMain'>
      <div className='login'>
        <div className='loginHead'>
          <h2>관리자 로그인</h2>
        </div>
        <div className='loginFormDiv'>
          <from className='loginForm'>
            <label>ID</label><input type='text' placeholder='아이디' className='idInput'/>
            <label>PW</label><input type='password' placeholder='비밀번호' className='pwInput'/>
          </from>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
