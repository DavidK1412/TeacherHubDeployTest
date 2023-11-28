import NavbarAdmin from "../../components/NavbarAdmin/NavbarAdmin.tsx";
import { ChangeEvent, useEffect, useState } from "react";
import { axiosInstance, deleteData, getData, postData, putData } from "../../api";
import { showAlert } from "../../utils/alertPrompts.ts";


interface TeachersData {
    id: string;
    name: string;
    subjects: Subject[];
}

interface Subject {
    id: string;
    name: string;
}

interface Teacher {
    id: string;
    name: string;
}

interface TeacherSubject {
    id: string;
    idTeacher: string;
    idSubject: string;
}

const TeachersAdmin = () => {
    const [data, setData] = useState<TeachersData[]>([])
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [formToModify, setFormToModify] = useState<boolean>(false)
    const [formToCreate, setFormToCreate] = useState<boolean>(false)
    const [formToAddSubject, setFormToAddSubject] = useState<boolean>(false)
    const [nameTeacher, setNameTeacher] = useState<string>('')
    const [selectedSubject, setSelectedSubject] = useState("");
    const [teacherToModify, setTeacherToModify] = useState<Teacher>({
        id: '',
        name: ''
    })

    const fetchListSubjects = () => {
        getData(
            axiosInstance,
            '/teacherhub/api/subjects',
            {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        ).then(response => {
            if (response.status === 200) {
                setSubjects(response.data)
            }
        }).catch(error => console.error(error))

    }

    const fetchListTeachers = () => {
        getData(
            axiosInstance,
            '/teacherhub/api/teachers',
            {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }).then(response => {

                if (response.status === 200) {
                    setData(response.data)
                }

            }).catch(error => console.error(error))
    }

    useEffect(() => {
        fetchListTeachers(),
            fetchListSubjects()
    }, [])

    const deleteTeacher = (id: string): void => {
        deleteData(
            axiosInstance,
            `teacherhub/api/teachers/${id}`,
            {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        ).then(response => {
            if (response.status === 200) {
                showAlert(
                    {
                        icon: 'success',
                        title: 'user delete',
                        text: 'Thanks for using TeacherHub',
                        buttonText: 'Ok',
                    }
                )
                fetchListTeachers()
            }
        }).catch(error => {
            console.error(error);
        });
    }


    const handlerShowForm = (item: TeachersData) => {

        console.error(item)


        const teacher: Teacher = {
            name: item.name,
            id: item.id
        }

        setTeacherToModify(teacher)

        setFormToModify(true)
    }

    const handlerShowFormToCreate = () => {
        setFormToCreate(true)
    }

    const handlerExitForm = () => {
        setFormToModify(false)
    }

    const handlerShowFormToAddSubject = () => {
        setFormToAddSubject(true)
    }

    const handlerExitFormToAddSubject = () => {
        setFormToAddSubject(false)
    }

    const handlerExitFormToCreate = () => {
        setFormToCreate(false)
    }

    const createTeacher = () => {
        const teacher: Teacher = {
            id: crypto.randomUUID(),
            name: nameTeacher
        }

        postData(axiosInstance,
            '/teacherhub/api/teachers',
            teacher,
            {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }).then(response => {
                if (response.status === 200) {
                    setFormToCreate(false)
                    showAlert({
                        icon: "success",
                        title: "The subject has been created",
                        text: "Thanks for using TeacherHub",
                        buttonText: "Ok",
                    });
                    fetchListTeachers()
                }
            }).catch(error => {
                console.error(error)
            })
    }

    const handleInputChange = (
        event: ChangeEvent<HTMLInputElement>,
        field: keyof Teacher
    ) => {
        if (teacherToModify) {
            const { value } = event.target;
            setTeacherToModify((prevData: Teacher) => {
                if (prevData) {
                    return {
                        ...prevData,
                        [field]: value,
                    };
                }
                return prevData;
            });
        }
    };

    const modifyTeacher = () => {
        if (teacherToModify) {
            putData(
                axiosInstance,
                `/teacherhub/api/teachers`,
                teacherToModify,
                {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            )
                .then((response) => {
                    if (response.status === 200) {
                        setFormToModify(false);
                        showAlert({
                            icon: "success",
                            title: "The subject has been modify",
                            text: "Thanks for using TeacherHub",
                            buttonText: "Ok",
                        });
                        fetchListTeachers()
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    const addTeacherSubject = () => {
        const teacherSubject: TeacherSubject = {
            id: crypto.randomUUID(),
            idTeacher: teacherToModify.id,
            idSubject: selectedSubject
        }

        console.log(teacherSubject)

        postData(axiosInstance,
            '/teacherhub/api/teacherSubject',
            teacherSubject,
            {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }).then(response => {
                if (response.status === 200) {
                    setFormToAddSubject(false)
                    showAlert({
                        icon: "success",
                        title: "The subject has been created",
                        text: "Thanks for using TeacherHub",
                        buttonText: "Ok",
                    });
                    fetchListTeachers()
                }
            }).catch(error => {
                console.error(error)
            })
    }

    return (
        <>
            <NavbarAdmin courses={false} teacher={true} users={false} />
            <div className="container">
                <div className="text-center mt-4">
                    <h1>Teachers</h1>
                </div>

                {
                    formToCreate && (
                        <div className="modal" tabIndex={-1} role="dialog" style={{ display: "block" }}>
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">CREATE NEW COURSE</h5>
                                        <button type="button" className="btn btn-outline-orange" onClick={handlerExitFormToCreate}>
                                            <span>&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="form-group">
                                                <label htmlFor="email">Type the new course:</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="email"
                                                    onChange={(event) => { setNameTeacher(event.target.value) }}
                                                />
                                            </div>
                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-outline-orange" onClick={handlerExitFormToCreate}>
                                            Exit
                                        </button>
                                        <button type="button" className="btn btn-orange" onClick={createTeacher}>
                                            Create
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }


                {
                    formToModify && (
                        <div className="modal" tabIndex={-1} role="dialog" style={{ display: "block" }}>
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">EDIT COURSE</h5>
                                        <button type="button" className="btn btn-outline-orange" onClick={handlerExitForm}>
                                            <span>&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="form-group">
                                                <label htmlFor="email">Type de the new course name:</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="email"
                                                    value={teacherToModify.name}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e, "name")}
                                                />
                                            </div>
                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-outline-orange" onClick={handlerExitForm}>
                                            Exit
                                        </button>
                                        <button type="button" className="btn btn-orange" onClick={modifyTeacher}>
                                            Update
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    formToAddSubject && (
                        <div className="modal" tabIndex={-1} role="dialog" style={{ display: "block" }}>
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">ADD COURSE</h5>
                                        <button type="button" className="btn btn-outline-orange" onClick={handlerExitForm}>
                                            <span>&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="form-group">
                                                <div className="input-group mb-3">
                                                    <select value={selectedSubject} className="form-select" id="inputGroupSelect02" onChange={(e) => setSelectedSubject(e.target.value)} >
                                                        {
                                                            subjects.map((subject) => (
                                                                <option key={subject.id} value={subject.id}>{subject.name}</option>
                                                            ))
                                                        }
                                                    </select>
                                                    <label className="input-group-text" htmlFor="inputGroupSelect02">Materia</label>
                                                </div>

                                            </div>
                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-outline-orange" onClick={handlerExitFormToAddSubject}>
                                            Exit
                                        </button>
                                        <button type="button" className="btn btn-orange" onClick={addTeacherSubject}>
                                            Update
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }


                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Subjects</th>
                            <th>Modify</th>
                            <th>Delete</th>
                            <th>Add</th> {/* Nueva columna para el botón + */}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((teachers: TeachersData) => (
                            <tr key={teachers.id}>
                                <td>{teachers.name}</td>
                                <td>
                                    <ul>
                                        {teachers.subjects.map((subject) => (
                                            <li key={subject.id}>{subject.name}</li>
                                        ))}
                                    </ul>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => {
                                            handlerShowForm(teachers);
                                        }}
                                    >
                                        Modify
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => {
                                            deleteTeacher(teachers.id);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-success"
                                        onClick={() => {
                                            teacherToModify.id = teachers.id;
                                            handlerShowFormToAddSubject();
                                        }}
                                    >
                                        +
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="text-center mt-4">
                    <button className="btn btn-outline-orange" onClick={handlerShowFormToCreate}>Create</button>
                </div>

            </div>
        </>
    );
}

export default TeachersAdmin