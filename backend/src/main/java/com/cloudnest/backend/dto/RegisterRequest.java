package com.cloudnest.backend.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String companyName;
    private String subdomain;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
}
