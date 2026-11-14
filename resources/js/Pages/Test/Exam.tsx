import ExamWorkspace from "@/Components/exam/ExamWorkspace";

export default function Exam({
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
            examScopeKey={`test_${test?.id ?? "unknown"}`}
            backHref={route("tests.index")}
            getQuestionRoute={(qid) => route("tests.exam", [test.id, qid])}
            bulkAnswersRoute={route("tests.answers.bulk", test.id)}
            submitRoute={route("tests.submit", test.id)}
            discardRoute={route("tests.discard", test.id)}
        />
    );
}
