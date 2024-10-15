import React, {useState} from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function SearchBar (props){
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const searchData = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // 폼 제출 기본 동작 방지
    navigate(`/searchresult?query=${encodeURIComponent(query)}`); // 쿼리 파라미터를 추가하여 검색 결과 페이지로 이동
    props.onSearch();
  };

  return (
  <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={query} onChange={searchData} placeholder="검색어를 입력 하세요..."/>
        <button type="submit"><FaSearch /></button>
      </form>
  </div>
  );
}

export default SearchBar;