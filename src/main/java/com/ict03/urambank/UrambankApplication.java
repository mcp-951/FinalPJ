package com.ict03.urambank;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.ict03.urambank.repository")
public class UrambankApplication {

	public static void main(String[] args) {
		SpringApplication.run(UrambankApplication.class, args);
	}

}
