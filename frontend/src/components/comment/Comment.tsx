import { Grade } from "../../interfaces/grade";

const CardComment = ({ grade }: { grade: Grade } ) => {
    return (
        <div className="card p-3 mb-3">
            <p className="mb-1">
                <strong>{grade.student.nickname}</strong>
            </p>

            <p className="my-2">
                {grade.comment}
            </p>

            <p className="mb-1">
                <strong>Nota:</strong> {grade.note} <strong className="ms-5">Es positivo:</strong> {grade.isPositive ? 'Sí' : 'No'}
            </p>
        </div>
    );
};

export default CardComment;