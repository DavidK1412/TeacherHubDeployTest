package com.TOTeams.TeacherHub.controllers;

import com.TOTeams.TeacherHub.models.Role;
import com.TOTeams.TeacherHub.models.User;
import com.TOTeams.TeacherHub.models.requests.StudentRequest;
import com.TOTeams.TeacherHub.models.responses.StudentResponse;
import com.TOTeams.TeacherHub.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Stream;
import com.TOTeams.TeacherHub.util.ResponseHandler;

@RestController
@RequestMapping("teacherhub/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<Object> getAllUsers(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(userService.getAllUsers(PageRequest.of(page, size)).getContent());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getUserById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(userService.getUserById(id));
        } catch (NoSuchElementException e) {
            return ResponseHandler
                .generateResponse(
                    HttpStatus.NOT_FOUND,
                    "auth/login",
                    "The users doesn't exists"
                );
        }
    }

    @PutMapping
    public ResponseEntity<Object> updateUser(@RequestBody StudentRequest student) {

        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (user.getRole() != Role.ADMIN) {
            if (!user.getId().equals(student.getId()))
                return ResponseHandler
                    .generateResponse(
                        HttpStatus.FORBIDDEN,
                        "users/update",
                        "You can only modify your own user."
                );
        }

        boolean allNeedFields = Stream.of(
            student.getId(),
            student.getNickname(),
            student.getEmail(),
            student.getActive().toString()
        ).allMatch(value -> value != null && !value.isEmpty());

        if(user.getRole() != Role.ADMIN){
            student.setIdRole(Role.USER.getValue());
        }

        if (!allNeedFields)
            return ResponseHandler
                .generateResponse(
                    HttpStatus.BAD_REQUEST,
                    "users/update",
                    "Any required field hasn't been specified or is invalid"
                );

        if(!userService.updateStudent(student)){
            return ResponseHandler.generateResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "users/update",
                "User not updated"
            );
        }

        return ResponseHandler
            .generateResponse(
                HttpStatus.OK,
                "users/update",
                "User updated successfully"
            );

    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> deleteUser(@PathVariable String id) {
        if(userService.deleteUser(id)){
            return ResponseHandler
                .generateResponse(
                    HttpStatus.OK,
                    "users/delete",
                    "User deleted successfully"
                );
        }
        return ResponseHandler.generateResponse(
                HttpStatus.BAD_REQUEST,
                "users/delete",
                "User not deleted"
        );
    }

}
