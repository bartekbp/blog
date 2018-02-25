package com.github.bartekbp;

import org.apache.ibatis.type.Alias;

@Alias("Data")
@lombok.Data
public class Data {
    String firstName;
    String lastName;
    String job;
    String phoneNumber;
    String email;
    String country;
}
