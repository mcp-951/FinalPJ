import React from "react";
import'../../resource/css/main/BottomBoard.css'

function BottomNoticeBoard(){
    return(
        <table className="boardTable">
            <thead>
                <tr>
                    <th className="title">Notice</th>
                    <th className="date"><button className="boardPlus">+ 더보기</button></th>
                </tr>
            </thead>
            <tbody>
                <tr> 
                    <td>공지사항 1일 입니다.</td>
                    <td>2024-09-10</td>
                </tr>
            </tbody>
        </table>
    );
}

export default BottomNoticeBoard;
