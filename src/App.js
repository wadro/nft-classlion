import React, {useState} from "react";
import logo from './logo.svg';
import {sendSupport, getBalance, readCount, setCount} from './api/UseCaver.js'
import './App.css';

// 1. Smart Contract 배포 주소 파악(가져오기)
// 2. caver.js 이용해서 스마트 컨트랙트 연동하기
// 3. 가져온 스마트 컨트랙트 실행 결과 웹에 표현하기


const onPressBalance = async (_setBalance) => {
  let address = '0x11e9fb7214f22bf1aab84688db89c94dec244757';
  _setBalance(await getBalance(address));
}

const onPressSupport = async (type, _setSupport, _setReceiver) => {
  let _support = await sendSupport(type);
  console.log(1, _support);

  if (_support == null) return false;

  let _balance = await getBalance(_support[0]);
 
  _setSupport(_balance);
  _setReceiver(_support[1]);
}

function App() {
  const [balance, setBalance] = useState('0');
  const [support, setSupport] = useState('0');
  const [receiver, setReceiver] = useState('0');

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={()=>{onPressBalance(setBalance)}}>나의 자산 확인</button>
        
        <h1>{balance} KLAY</h1>

        <button onClick={()=>{onPressSupport(0, setSupport, setReceiver)}}>어린이 재단 후원하기</button>
        <br/>
        <button onClick={()=>{onPressSupport(1, setSupport, setReceiver)}}>고양이 보호 협회 후원하기</button>
        <br/>
        <button onClick={()=>{onPressSupport(2, setSupport, setReceiver)}}>세계보건기구 후원하기</button>
        <br/>

        <div>
          {receiver} 총 후원금 {support} KLAY
        </div>

        <p>0.01 KLAY씩 송금됩니다 :)</p>
      </header>
    </div>
  );
}

export default App;
