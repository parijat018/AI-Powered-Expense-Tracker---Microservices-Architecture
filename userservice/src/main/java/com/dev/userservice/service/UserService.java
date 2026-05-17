package com.dev.userservice.service;

import com.dev.userservice.entities.UserInfo;
import com.dev.userservice.entities.UserInfoDto;
import com.dev.userservice.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.function.Supplier;
import java.util.function.UnaryOperator;

@Service
@RequiredArgsConstructor
public class UserService {

    @Autowired
    private final UserRepository userRepository;

    ////////////////////////////////////////////////////
    // CREATE OR UPDATE USER
    ////////////////////////////////////////////////////

    public UserInfoDto createOrUpdateUser(
            UserInfoDto userInfoDto
    ) {

        UnaryOperator<UserInfo> updatingUser =
                user -> {
                    return userRepository.save(
                            userInfoDto.transformToUserInfo()
                    );
                };

        Supplier<UserInfo> createUser =
                () -> {
                    return userRepository.save(
                            userInfoDto.transformToUserInfo()
                    );
                };

        UserInfo userInfo =
                userRepository.findByUserId(
                                userInfoDto.getUserId()
                        )
                        .map(updatingUser)
                        .orElseGet(createUser);

        return new UserInfoDto(
                userInfo.getUserId(),
                userInfo.getFirstName(),
                userInfo.getLastName(),
                userInfo.getPhoneNumber(),
                userInfo.getEmail(),
                userInfo.getProfilePic()
        );
    }

    ////////////////////////////////////////////////////
    // GET USER USING DTO
    ////////////////////////////////////////////////////

    public UserInfoDto getUser(
            UserInfoDto userInfoDto
    ) throws Exception {

        Optional<UserInfo> userInfoDtoOpt =
                userRepository.findByUserId(
                        userInfoDto.getUserId()
                );

        if(userInfoDtoOpt.isEmpty()) {
            throw new Exception("User not found");
        }

        UserInfo userInfo =
                userInfoDtoOpt.get();

        return new UserInfoDto(
                userInfo.getUserId(),
                userInfo.getFirstName(),
                userInfo.getLastName(),
                userInfo.getPhoneNumber(),
                userInfo.getEmail(),
                userInfo.getProfilePic()
        );
    }

    ////////////////////////////////////////////////////
    // GET USER BY ID
    ////////////////////////////////////////////////////

    public UserInfoDto getUserById(
            String userId
    ) throws Exception {

        Optional<UserInfo> userInfoOpt =
                userRepository.findByUserId(userId);

        if(userInfoOpt.isEmpty()) {
            throw new Exception("User not found");
        }

        UserInfo userInfo =
                userInfoOpt.get();

        return new UserInfoDto(
                userInfo.getUserId(),
                userInfo.getFirstName(),
                userInfo.getLastName(),
                userInfo.getPhoneNumber(),
                userInfo.getEmail(),
                userInfo.getProfilePic()
        );
    }
}