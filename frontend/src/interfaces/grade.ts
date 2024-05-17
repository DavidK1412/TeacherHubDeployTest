interface Student {
  id: string,
  nickname: string,
  email: string
}

export interface Grade {
  id: string,
  student: Student,
  idTeacherSubject: string,
  comment: string,
  isPositive: boolean,
  note: number
}