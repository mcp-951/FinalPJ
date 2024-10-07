package com.ict03.urambank.entity;

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
@Table(name = "ADMIN_TB")
public class AdminEntity {

    @Id
    @Column
    private int adminNo;

    @Column
    private String adminID;

    @Column
    private String adminPW;
}
