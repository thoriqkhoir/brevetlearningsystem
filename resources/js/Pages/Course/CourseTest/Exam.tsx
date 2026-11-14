import ExamWorkspace from "@/Components/exam/ExamWorkspace";

export default function Exam({
    course,
    test,
    attemptId,
    attemptSignature,
    currentQuestion,
    nextQuestionId,
    prevQuestionId,
    questionIndex,
    answeredQuestionIds = [],
    currentAnswer,
    deadline,
    serverNow,
    durationDeadline,
}: any) {
    return (
        <ExamWorkspace
            test={test}
            attemptId={attemptId}
            attemptSignature={attemptSignature}
            currentQuestion={currentQuestion}
            nextQuestionId={nextQuestionId}
            prevQuestionId={prevQuestionId}
            questionIndex={questionIndex}
            answeredQuestionIds={answeredQuestionIds}
            currentAnswer={currentAnswer}
            deadline={deadline}
            serverNow={serverNow}
            durationDeadline={durationDeadline}
            examScopeKey={`course_test_${test?.id ?? "unknown"}`}
            backHref={route("courses.courseTests.detail", [course.id, test.id])}
            getQuestionRoute={(qid) =>
                route("courses.courseTests.exam", [course.id, test.id, qid])
            }
            bulkAnswersRoute={route("courses.courseTests.answers.bulk", [
                course.id,
                test.id,
            ])}
            submitRoute={route("courses.courseTests.submit", [course.id, test.id])}
            discardRoute={route("courses.courseTests.discard", [
                course.id,
                test.id,
            ])}
        />
    );
}
