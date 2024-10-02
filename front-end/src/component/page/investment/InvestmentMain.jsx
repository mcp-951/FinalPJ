import React from "react";
import InvestmentRight from'./InvestmentRight';
import StockMain from "./StockMain";
import'../../../resource/css/investment/InvestmentMain.css'

function InvestmentMain(){

    return (
        <div className="investConteiner">
          <div className="Content">
            {/* 주식바 시작. */}
            <div className="StockBar">
              <div className="StockBarTitle">
                <h4>주가지수</h4>
                <a href="/">+ 더보기</a>
              </div>
              <StockMain title={"코스피"} price={"\\2581.3"} p1 ={0} p2 ={"2500"} p3 ={"2551"} p4 ={"2552"} p5 ={""} p6 ={""} p7 ={""}/>
              <StockMain title={"코스닥"} price={"\\781.3"} p1 ={"5000"} p2 ={"2000"} p3 ={"4000"} p4 ={"3000"} p5 ={"3500"} p6 ={"2000"} p7 ={"1500"}/>
              <StockMain title={"나스닥"} price={"$18,119.3"} p1 ={0} p2 ={""} p3 ={""} p4 ={""} p5 ={""} p6 ={""} p7 ={""}/>
              <StockMain title={"다우지수"} price={"$42,313.0"} p1 ={0} p2 ={""} p3 ={""} p4 ={""} p5 ={""} p6 ={""} p7 ={""}/>
            </div>
            {/* 주식바 끝. */}
            {/* 코인바 시작됩니다. */}
            <div className="CoinBar">
              <div className="CoinBarTitle">
                <h4>코인동향</h4>
                <a href="/">+ 더보기</a>
              </div>
              <StockMain title={"비트코인"} price={"$66,321.3"} p1 ={0} p2 ={""} p3 ={""} p4 ={""} p5 ={""} p6 ={""} p7 ={""}/>
              <StockMain title={"이더리움"} price={"$4123.3"} p1 ={0} p2 ={""} p3 ={""} p4 ={""} p5 ={""} p6 ={""} p7 ={""}/>
              <StockMain title={"솔라나"} price={"$173.3"} p1 ={0} p2 ={""} p3 ={""} p4 ={""} p5 ={""} p6 ={""} p7 ={""}/>
              <StockMain title={"리플"} price={"$0.58"} p1 ={0} p2 ={""} p3 ={""} p4 ={""} p5 ={""} p6 ={""} p7 ={""}/>
            </div>
            {/* 코인바 끝. */}
          </div>
          <div className="RightList">
            <InvestmentRight />
          </div>
        </div>
    );
}

export default InvestmentMain;