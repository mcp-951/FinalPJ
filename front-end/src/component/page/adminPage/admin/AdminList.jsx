import React, { useState, useEffect } from 'react'; // React 및 useState, useEffect 훅 가져오기
import ApiService from '../service/ApiService';  // API 호출을 위한 ApiService 임포트
import '../../../../resource/css/admin/AdminList.css'; // 관리자 리스트 CSS 파일 가져오기
import Sidebar from '../Sidebar'; // 사이드바 컴포넌트 가져오기

const AdminList = () => {
  const [admins, setAdmins] = useState([]); // 관리자 목록을 저장할 상태 변수

  // 백엔드에서 관리자 목록을 가져오는 useEffect 훅
  useEffect(() => {
    ApiService.get('/getAdminList') // 관리자 목록 API 호출
      .then((response) => {
        setAdmins(response.data); // 받아온 데이터를 상태에 저장
      })
      .catch((error) => {
        console.error('관리자 목록을 불러오는 중 오류 발생:', error); // 에러 발생 시 콘솔에 출력
      });
  }, []); // 빈 배열을 주어 컴포넌트가 처음 마운트될 때만 호출되도록 설정

  return (
    <div className="admin-container">
      <Sidebar /> {/* 사이드바 추가 */}
      <div className="main-content"/>
      <div className="admin-list-container">
        <h2>관리자 리스트</h2> {/* 제목 */}

        {/* 관리자 목록 테이블 */}
        <table className="admin-table">
          <thead>
            <tr>
              <th>No</th> {/* 번호 */}
              <th>관리자 아이디</th> {/* 관리자 아이디 */}
              <th>관리자 이름</th> {/* 관리자 이름 */}
              <th>상태</th> {/* 상태 표시 */}
              <th>마지막 작업</th> {/* 마지막 작업 기록 */}
              <th>마지막 로그인</th> {/* 마지막 로그인 시간 */}
            </tr>
          </thead>
          <tbody>
            {admins.map((admin, index) => ( // 관리자 목록을 순회하며 테이블 행 생성
              <tr key={admin.adminNo}>
                <td>{index + 1}</td> {/* 순서 번호 */}
                <td>{admin.adminID}</td> {/* 관리자 아이디 */}
                <td>{admin.adminName}</td> {/* 관리자 이름 */}
                <td>{admin.stateView === 'y' ? '활성' : '비활성'}</td> {/* 상태 표시 */}
                <td>{admin.lastAction || '없음'}</td> {/* 마지막 작업 */}
                <td>{admin.lastLogin ? admin.lastLogin : '없음'}</td> {/* 마지막 로그인 시간 */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminList; // AdminList 컴포넌트 내보내기
