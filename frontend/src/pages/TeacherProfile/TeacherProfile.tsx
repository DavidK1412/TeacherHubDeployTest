import { useLocation } from "react-router-dom";
import NavbarLogged from "../../components/NavbarLogged/NavbarLogged.tsx";
import { Course } from "../../interfaces/course.ts";
import { getData, postData } from "../../api/methods.ts";
import { axiosInstance } from "../../api/index.ts";
import { Teacher } from "../../interfaces/teacher.ts";
import { Grade } from "../../interfaces/grade.ts";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "../../interfaces/token.ts";
import { GradeRequest } from "../../interfaces/gradeRequest.ts";
import CardComment from "../../components/comment/Comment.tsx";
import { showAlert } from "../../utils/alertPrompts.ts";

const TeacherProfile = () => {

    const { teacher, course }: {teacher: Teacher, course: Course} = useLocation().state;

    const [teacherSubjectId, setTeacherSubjectId] = useState<string | null>(null);
    const [grade, setGrade] = useState<GradeRequest | null>();
    const [grades, setGrades] = useState<[Grade] | []>([]);
    const [page, setPage] = useState<number>(0);

    /**
     * Get the teacherSubjectId as of the teacherId and courseId
     */
    useEffect(() => {
        getData(
            axiosInstance, 
            `teacherhub/api/teacherSubject/${teacher.id}/${course.id}`,
            {'Authorization': `Bearer ${localStorage.getItem('token')}`}
        ).then((data) => {
            setTeacherSubjectId(data.data);
        }).catch((error) => {
            console.log("[ERROR]: error has been ocurred while retrieving the teacher subject id. " + error.message)
        })

    }, [setTeacherSubjectId, teacher.id, course.id]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        let decodedToken: DecodedToken; 
        
        if (token && teacherSubjectId) {
            decodedToken = jwtDecode(token);
            setGrade({
                id: crypto.randomUUID(),
                idStudent: decodedToken.user_id,
                idTeacherSubject: teacherSubjectId,
                comment: "",
                note: 0,
                isPositive: false
            });
        }
    }, [setGrade, teacherSubjectId]);

    useEffect(() => {
        const fetchComments = () => {
            getData(
                axiosInstance,
                `teacherhub/api/grades/${teacherSubjectId}?page=${page}&size=10`,
                {'Authorization': `Bearer ${localStorage.getItem('token')}`}
            ).then(({ data }) => {
                setGrades(data as [Grade])
            }).catch((error) => {
                console.error(error);
            })
        }

        if (teacherSubjectId) fetchComments();

    }, [teacherSubjectId, page]);

    const handleGradeComment = (text: string) => {
        setGrade({...grade, comment: text} as GradeRequest);
    }

    const handleGradeNote = (event: React.ChangeEvent<HTMLInputElement>) => {
        const note: number = event.target.value as unknown as number;
        setGrade({
            ...grade, 
            note: note, 
            isPositive: (note > 3) ? true : false,
        } as GradeRequest);
    }

    const saveGrade = () => {
        postData(
            axiosInstance,
            'teacherhub/api/grades',
            grade,
            {'Authorization': `Bearer ${localStorage.getItem('token')}`}

        ).then(() => {
            showAlert(
                {
                    icon: 'success',
                    title: 'Rated',
                    text: `Your opinion has been saved`,
                    buttonText: 'Ok',
                }
            )
        }).catch((error) => {
            if (error.response.data.status === 409) 
                showAlert(
                    {
                        icon: 'warning',
                        title: 'Alredy rated',
                        text: `You can't rated this teacher because you have already rated it`,
                        buttonText: 'Ok',
                    }
                )
        })
    };

    return (
        <>
            <NavbarLogged teacher={false} courses={false} profile={false} />
            <div className="container main-container my-5">
                <div className="row">
                    <div className="col-md-4 d-flex justify-content-center">
                        <aside className="user-info">
                            <img
                                src="https://www.alchinlong.com/wp-content/uploads/2015/09/sample-profile.png"
                                alt="Profile"
                                className="rounded-circle img-fluid my-5 mx-auto d-flex"
                                style={{ maxWidth: '128px' }}
                            />
                            <p className="my-2">{teacher.name}</p>
                            <p className="my-2">{course.name}</p>
                            <p className="my-2">Defeat: </p>
                            <p className="my-2">Grade: </p>
                        </aside>
                    </div>
                    <div className="col-md-8">
                        <div className="user-options courses-list d-flex flex-column my-3">
                            <div>
                                <div className="form-group my-2">
                                    <label className="mb-2">Share your opinion:</label>
                                    <textarea 
                                        className="form-control" 
                                        id="comment" 
                                        rows={3} 
                                        onChange={e => handleGradeComment(e.target.value)} 
                                        defaultValue={grade?.comment}
                                        placeholder="Write your comment">    
                                    </textarea>
                                </div>
                                <div className="form-group my-2 d-flex align-items-center justify-content-end">
                                    <label htmlFor="calificacion" className="mr-2">Grade</label>
                                    <input
                                        className="form-control mx-2" 
                                        id="note" 
                                        style={{ width: "80px" }} 
                                        onChange={handleGradeNote}
                                        placeholder="Ej. 4.3"
                                    />
                                    <button 
                                        className="btn btn-primary mx-2" 
                                        onClick={saveGrade}
                                        disabled={(grade) ? Object.keys(grade).length !== 6 : true}
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                            <ul className="pagination">
                                <li className="page-item"><a className="page-link" onClick={() => setPage(prevCount => prevCount - 1)}>Previous</a></li>
                                <li className="page-item"><a className="page-link" onClick={() => setPage(0)}>1</a></li>
                                <li className="page-item"><a className="page-link" onClick={() => setPage(1)}>2</a></li>
                                <li className="page-item"><a className="page-link" onClick={() => setPage(2)}>3</a></li>
                                <li className="page-item"><a className="page-link" onClick={() => setPage(prevCount => prevCount + 1)}>Next</a></li>
                            </ul>
                            <div className="comments-list">
                                {grades.length > 0 
                                    ? grades.map(grade => <CardComment key={grade.id} grade={grade}/>) 
                                    : <div className="d-flex justify-content-center mt-5">
                                        <div className="spinner-border" role="status" style={{width: "3rem", height: "3rem"}}>
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TeacherProfile
