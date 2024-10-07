package com.ict03.urambank.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.sql.Date;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "Log_TB")
public class LogEntity {
    @Id
    @Column
    private int logNo;

    @Column
    private int sendAccountNo;

    @Column
    private int receiveAccountNo;

    @Column
    private int sendPrice;

    @Column
    private Date sendDate;

    @Column
    private String logState;
}
