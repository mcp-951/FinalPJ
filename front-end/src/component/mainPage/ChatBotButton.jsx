import React, { useState } from 'react';
import { RiRobot2Line, RiCloseLine } from "react-icons/ri"; // 아이콘 추가
import 'resource/css/main/ChatBotButton.css'; // CSS import

function ChatBotButton() {
    const [form, setForm] = useState({
        message: ''
    });
    const [showModal, setShowModal] = useState(false);
    const [getChat, setGetChat] = useState(false);
    const [messages, setMessages] = useState([]); // 채팅 메시지 상태 추가
    const [isRecording, setIsRecording] = useState(false); // 녹음 상태 추가

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleModalToggle = () => {
        setShowModal(!showModal);
    };

    const startChat = () => {
        setGetChat(true);
    };

    const sendMessage = async () => {
        const userMessage = form.message;

        // 사용자 메시지를 채팅 상자에 추가
        setMessages([...messages, { sender: 'User', text: userMessage }]);

        // 서버로 메시지 전송
        const response = await fetch('http://13.125.114.85:5000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage })
        });

        const data = await response.json();
        const botReply = data.reply;

        // 봇 응답을 채팅 상자에 추가
        setMessages([...messages, { sender: 'User', text: userMessage }, { sender: 'Bot', text: botReply }]);

        // 입력 필드 초기화
        setForm({ message: '' });
    };

    const toggleRecording = async () => {
        if (!isRecording) {
            // 녹음 시작
            setIsRecording(true); // 녹음 시작 상태로 변경
            // 서버에 녹음 요청 (가정: 서버에서 텍스트 변환 후 응답)
            try {
                const response = await fetch('http://13.125.114.85:5000/voice');
                const text = await response.json();
                const text2 = text.text;

                // 녹음 결과를 입력 필드에 반영
                setForm({ message: text2 });
            } catch (error) {
                console.error("Error during recording:", error);
            } finally {
                setIsRecording(false); // 녹음 완료 후 상태 변경
            }
        } else {
            // 녹음 완료
            setIsRecording(false);
        }
    };

    return (
        <div>
            {/* 챗봇 버튼 */}
            <div className="topBtn_wrap">
                <button className="topBtn" onClick={handleModalToggle}>
                    {showModal ? <RiCloseLine /> : <RiRobot2Line />} {/* 버튼 상태에 따라 아이콘 변경 */}
                </button>
            </div>

            {/* 챗봇 모달 */}
            {showModal && (
                <div className="chatbotModal">
                    {/* 챗봇 헤더 */}
                    <div className="chatbotHeader">
                        <div className="chatbotInfo">
                            <RiRobot2Line size={30} />
                        </div>
                        <span className="chatbotName">URAM 고객상담봇</span>
                    </div>
                    {getChat === false && (
                        <>
                            <div className="chatbotBody">
                                <p>고객님! 도움이 필요하신가요? 대화를 시작해보세요.</p>
                            </div>
                            <div className="chatbotFooter">
                                <button className="startButton" onClick={startChat}>시작하기</button>
                            </div>
                        </>
                    )}
                    {getChat === true && (
                        <>
                            <div className="chatbotBody">
                                <RiRobot2Line />
                                <p>안녕하세요 URAM 고객님! 무엇을 도와드릴까요?</p>
                                <div id="messages">
                                    {messages.map((message, index) => (
                                        <div key={index} className={message.sender === 'User' ? 'userMessage' : 'botMessage'}>
                                            {message.sender}: {message.text}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="chatbotFooter">
                                <input
                                    type="text"
                                    id="userInput"
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    disabled={isRecording} // 녹음 중일 때 입력 비활성화
                                />
                                <button
                                    onClick={toggleRecording}
                                >
                                    {isRecording ? '녹음중..' : '녹음'}
                                </button>
                                <button
                                    className="startButton"
                                    onClick={sendMessage}
                                    disabled={isRecording} // 녹음 중일 때 전송 버튼 비활성화
                                >
                                    전송
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default ChatBotButton;
