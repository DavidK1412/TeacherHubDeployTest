package com.TOTeams.TeacherHub.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
  name = "subject",
  uniqueConstraints = {
    @UniqueConstraint(columnNames = {"name"}),
    @UniqueConstraint(columnNames = {"id_subject"})
  }
)
public class Subject {
    @Id
    @Column(name = "id_subject", columnDefinition = "varchar(36)")
    String id;
  
    @Column(name = "name", nullable = false)
    String name;

    @ManyToMany
    @JsonBackReference
    @JoinTable(
        name = "professor_subject",
        joinColumns = @JoinColumn(name = "id_subject", referencedColumnName = "id_subject"),
        inverseJoinColumns = @JoinColumn(name = "id_professor", referencedColumnName = "id")
    )
    List<Teacher> teachers = new ArrayList<>();

}
