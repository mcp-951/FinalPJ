package com.urambank.uram.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class PickUpPlaceDTO {

    private int pickUpPlaceNo;
    private String pickUpPlaceName;
    private String pickUpAddress;
    private String pickUpPlacePic;

    public PickUpPlaceDTO(String pickUpPlaceName) {
    }
}
