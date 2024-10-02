import React from "react";
import'../../resource/css/main/BottomBoard.css'

function BottomNewsBoard(){
    return(
        <table className="boardTable">
            <thead>
                <tr>
                    <th className="title">News</th>
                    <th className="date"><button className="boardPlus">+ 더보기</button></th>
                </tr>
            </thead>
            <tbody>
                <tr> 
                    <td>1. 첫번째 뉴스 게시글 입니다.</td>
                    <td>2024-09-10</td>
                </tr>
            </tbody>
        </table>
    );
}

export default BottomNewsBoard;
