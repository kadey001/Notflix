package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class NotflixApplication {

	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(NotflixApplication.class);
		app.run(args);
	}

}
