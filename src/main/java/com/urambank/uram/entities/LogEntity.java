package com.urambank.uram.entities;

import jakarta.persistence.*;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int logNo;

    @Column
<<<<<<< HEAD
    private String sendAccountNumber;

    @Column
    private String receiveAccountNumber;
=======
    private String sendAccountNo;

    @Column
    private String receiveAccountNo;
>>>>>>> origin/main

    @Column
    private int sendPrice;

    @Column
    private Date sendDate;

    @Column
    private String logState;
}
