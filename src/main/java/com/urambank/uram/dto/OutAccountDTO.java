package com.urambank.uram.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class OutAccountDTO {

    @JsonProperty("oAccountNo")  // JSON 필드와 DTO 필드가 일치하는지 명확히 함
    private int oAccountNo;

    @JsonProperty("oAccountNumber")  // JSON 필드 이름과 DTO 필드 이름이 정확히 매핑되도록 지정
    private String oAccountNumber;

    @JsonProperty("oUserName")  // JSON 필드와 DTO 필드가 일치하도록 지정
    private String oUserName;

    @JsonProperty("oAccountState")  // JSON 필드와 DTO 필드가 일치하도록 지정
    private String oAccountState;

    @JsonProperty("oBankName")  // JSON 필드와 DTO 필드가 일치하도록 지정
    private String oBankName;
}
