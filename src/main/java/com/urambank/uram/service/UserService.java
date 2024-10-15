package com.urambank.uram.service;

import com.urambank.uram.dto.UserDTO;
import com.urambank.uram.entities.User;
import com.urambank.uram.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.response.SingleMessageSentResponse;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;
import java.util.List;
import java.util.Random;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final DefaultMessageService messageService;

    public String findByUserId(String userId) {
        System.out.println("<<< UserService - findByUserId() >>>");
            User user = new User();
        try{
            user = userRepository.findByUserId(userId);
            return user.getUserId();
        }catch(NullPointerException e){
            return "";
        }
    }

    public UserDTO register(UserDTO userDTO) {
        System.out.println("<<< UserService - register() >>>");
        System.out.println("id : " + userDTO.getUserId());
        System.out.println("Pw : " + userDTO.getUserPw());

        UserDTO dto = new UserDTO();
        userDTO.setResidentNumber(userDTO.getResidentNumber1() + "-" + userDTO.getResidentNumber2());
        userDTO.setAddress(userDTO.getAddress1() + userDTO.getAddress2());
        userDTO.setEmail(userDTO.getEmail1()+ "@" + userDTO.getEmail2());

        try {
            // 사용자 정보 설정 및 비밀번호 암호화
            User user = new User();
//            user.setUserNo(userNo);
            user.setUserId(userDTO.getUserId());
            user.setHp(userDTO.getHp());
            user.setEmail(userDTO.getEmail());
            user.setResidentNumber(userDTO.getResidentNumber());
            user.setName(userDTO.getName());
            String encodingPw = passwordEncoder.encode(userDTO.getUserPw());
            System.out.println("encodingPw : " + encodingPw);
            user.setUserPw(encodingPw);  // 비밀번호 암호화
            user.setBirth(userDTO.getBirth());
            user.setAddress(userDTO.getAddress());
            user.setUserRole("USER");
            user.setState('y');

            // 사용자 저장
            User savedUser = userRepository.save(user);
            System.out.println("No : " + savedUser.getUserNo());
            // 저장 성공 시 DTO에 값 설정
            if (savedUser.getUserNo() > 0) {
                dto.setUserlist(savedUser);
                dto.setMessage("User Registered Successfully");
                dto.setStatusCode(200);
            }

        } catch (Exception e) {
            e.printStackTrace(); // 추가
            dto.setStatusCode(500);
            dto.setMessage(e.getMessage());
        }
        return dto;
    }

    public int rand(){
        Random random = new Random();
        int i = random.nextInt(899999)+11111;
        return i;
    }

    public SingleMessageSentResponse sendSMS(String hp,int i) {
        String api_key = "NCSWFN2OVSKW3MPS"; // 발급받은 api_key
        String api_secret = "P9YBFDGTRQNVQ2KXSP7NGF1BE7PLX5DP"; // 발급받은 api_secret
        Message message = new Message();

        message.setFrom("01055617726");
        message.setTo(hp);
        message.setText("인증번호를 입력해주세요. 인증번호는 " + i + " 입니다.");
        NurigoApp.INSTANCE.initialize(
                "NCSWFN2OVSKW3MPS",
                "P9YBFDGTRQNVQ2KXSP7NGF1BE7PLX5DP",
                "https://api.coolsms.co.kr"
        );
        SingleMessageSentResponse response = messageService.sendOne(new SingleMessageSendingRequest(message));
        System.out.println(response);

        return response;
    }
    public int checkHp(String hp){
        int authKey = rand();
        sendSMS(hp,authKey);
        return authKey;
    }

    public List<User> getUsersByRoleUser() {
        return userRepository.findByUserRole("ROLE_USER");
    }

    // userId로 userNo 가져오기
    public int getUserNoByUserId(String userId) {
        User user = userRepository.findByUserId(userId);
        return user.getUserNo();  // userNo 반환
    }

    public String getUserNameByUserNo(int userNo) {
        User user = userRepository.findById(userNo).orElseThrow(() -> new RuntimeException("User not found"));
        return user.getName();
    }

    public int getUserNoByName(String name) {
        User user = userRepository.findByName(name);
        return user != null ? user.getUserNo() : null;
    }

}
