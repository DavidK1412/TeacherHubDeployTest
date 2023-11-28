package com.TOTeams.TeacherHub.controllers;

import com.TOTeams.TeacherHub.models.TeacherSubject;
import com.TOTeams.TeacherHub.models.requests.TeacherSubjectRequest;
import com.TOTeams.TeacherHub.services.TeacherSubjectService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("teacherhub/api/teacherSubject")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class TeacherSubjectController {

  @Autowired
  private final TeacherSubjectService teacherSubjectService;

  @GetMapping("/{teacherSubjectId}")
  public ResponseEntity<Object> getTeacherSubjectsByTeacherId(
      @PathVariable String teacherSubjectId,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size
  ) {
    return
      ResponseEntity.ok(
        teacherSubjectService
          .getTeacherSubjectsByTeacherId(
            teacherSubjectId,
            PageRequest.of(page, size)
          ).getContent());
  }

  /**
   * This method returns the teacherSubjectId as of the teacherId and subjectId.
   * Only returns the teacherSubjectId because in the comment or grade sections already has been get the teacher and subject objects.
   *
   * @param teacherId
   * @param subjectId
   * @return teacherSubjectId
   */
  @GetMapping("/{teacherId}/{subjectId}")
  public ResponseEntity<Object> getTeacherSubjectIdByTeacherIdAndSubjectId(
    @PathVariable String teacherId,
    @PathVariable String subjectId
  ) {
    return ResponseEntity.ok(teacherSubjectService.getTeacherSubjectByTeacherAndSubject(teacherId, subjectId).getId());
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PostMapping
  public ResponseEntity<Object> saveTeacherSubject(@RequestBody TeacherSubjectRequest teacherSubject) {
    TeacherSubject teacherSubjectSaved = teacherSubjectService.saveTeacherSubject(teacherSubject);
    if (teacherSubjectSaved != null) return ResponseEntity.ok(teacherSubjectSaved);
    return ResponseEntity.internalServerError().build();
  }

}
