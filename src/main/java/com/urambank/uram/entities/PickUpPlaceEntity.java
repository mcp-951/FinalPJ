package com.urambank.uram.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "PickUpPlace_TB")
public class PickUpPlaceEntity {

    @Id
    @Column
    private int pickUpPlaceNo;

    @Column
    private String pickupPlaceName;

    @Column
    private String pickUpAddress;




}
