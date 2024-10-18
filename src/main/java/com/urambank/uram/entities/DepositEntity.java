package com.urambank.uram.entities;

import jakarta.persistence.*;
import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name = "deposit_TB")
public class DepositEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "depositNo")
    private int depositNo;

    @Column(name = "depositName")
    private String depositName;

    @Column(name = "depositRate")
    private float depositRate;

    @Column(name = "depositContent")
    private String depositContent;

    @Column(name = "depositCategory")
    private int depositCategory;

    @Column(name = "depositIMG")
    private String depositIMG;

    @Column(name = "depositState")
    private char depositState;
}
