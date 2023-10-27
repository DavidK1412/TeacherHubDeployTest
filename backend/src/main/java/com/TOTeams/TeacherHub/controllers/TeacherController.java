package com.TOTeams.TeacherHub.controllers;

import com.TOTeams.TeacherHub.security.models.TeacherResponse;
import com.TOTeams.TeacherHub.services.TeacherService;
import com.TOTeams.TeacherHub.util.ResponseHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Stream;

@RestController
@RequestMapping("/teachers")
@RequiredArgsConstructor
public class TeacherController {
    private final TeacherService teacherService;

    @GetMapping
    public ResponseEntity<Object> getAllTeachers() {
        List<TeacherResponse> teachers = teacherService.getAllTeachers();
        if(teachers.isEmpty())
            return ResponseHandler
                    .generateResponse(
                            HttpStatus.NOT_FOUND,
                            "teachers",
                            "There are no teachers"
                    );
        return ResponseEntity.ok(teachers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getTeacherById(@PathVariable String id) {
        TeacherResponse teacher = teacherService.getTeacherById(id);
        if(teacher == null)
            return ResponseHandler
                    .generateResponse(
                            HttpStatus.NOT_FOUND,
                            "teachers",
                            "Teacher not found"
                    );
        return ResponseEntity.ok(teacher);
    }

    @PostMapping
    public ResponseEntity<Object> createTeacher(@RequestBody TeacherResponse teacher) {
        boolean allNeedFields = Stream.of(
                teacher.getId(),
                teacher.getName()
        ).allMatch(value -> value != null && !(value instanceof String) || !((String) value).isEmpty());

        if(!allNeedFields)
            return ResponseHandler
                    .generateResponse(
                            HttpStatus.BAD_REQUEST,
                            "teachers/create",
                            "Any required field hasn't been specified"
                    );

        if(teacherService.addTeacher(teacher)){
            return ResponseHandler
                    .generateResponse(
                            HttpStatus.OK,
                            "teachers/create",
                            "Teacher created successfully"
                    );
        }
        return ResponseHandler.generateResponse(
                HttpStatus.BAD_REQUEST,
                "teachers/create",
                "Teacher not created"
        );
    }

    @PutMapping
    public ResponseEntity<Object> updateTeacher(@RequestBody TeacherResponse teacher) {
        boolean allNeedFields = Stream.of(
                teacher.getId(),
                teacher.getName()
        ).allMatch(value -> value != null && !(value instanceof String) || !((String) value).isEmpty());

        if(!allNeedFields)
            return ResponseHandler
                    .generateResponse(
                            HttpStatus.BAD_REQUEST,
                            "teachers/update",
                            "Any required field hasn't been specified"
                    );

        if(teacherService.updateTeacher(teacher)){
            return ResponseHandler
                    .generateResponse(
                            HttpStatus.OK,
                            "teachers/update",
                            "Teacher updated successfully"
                    );
        }
        return ResponseHandler.generateResponse(
                HttpStatus.BAD_REQUEST,
                "teachers/update",
                "Teacher not updated"
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteTeacher(@PathVariable String id) {
        if(teacherService.deleteTeacher(id)){
            return ResponseHandler
                    .generateResponse(
                            HttpStatus.OK,
                            "teachers/delete",
                            "Teacher deleted successfully"
                    );
        }
        return ResponseHandler.generateResponse(
                HttpStatus.BAD_REQUEST,
                "teachers/delete",
                "Teacher not deleted"
        );
    }
}