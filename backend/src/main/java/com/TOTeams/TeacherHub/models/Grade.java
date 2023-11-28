package com.TOTeams.TeacherHub.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(
  name = "grade",
  uniqueConstraints = {
    @UniqueConstraint(columnNames = {"id"})
  }
)
public class Grade {

  @Id
  @Column(columnDefinition = "varchar(36)")
  private String id;

  @ManyToOne
  @JoinColumn(name = "id_student")
  @ToString.Exclude
  private User student;

  @ManyToOne
  @JoinColumn(name = "id_professor_subject")
  @ToString.Exclude
  private TeacherSubject teacherSubject;

  @Column(nullable = false)
  private String comment;

  @Column(nullable = false)
  private Boolean isPositive;

  @Column(nullable = false)

  private Float note;
}
