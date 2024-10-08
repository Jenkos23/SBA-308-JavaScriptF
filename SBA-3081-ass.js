// Course Information
const CourseInfo = {
    id: 800,
    name: "Introduction to Bible Revelation"
};

// Assignment Group
const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of Grace",
    course_id: 800,
    group_weight: 25,
    assignments: [
        {
            id: 1,
            name: "Seeing the Divine Facts",
            due_at: "2023-01-25",
            points_possible: 50
        },
        {
            id: 2,
            name: "Abrahamic Blessings",
            due_at: "2023-02-27",
            points_possible: 150
        },
        {
            id: 3,
            name: "Rule Your World",
            due_at: "2023-03-15", 
            points_possible: 500
        }
    ]
};

// The provided learner submission data.
const LearnerSubmissions = [
    {
        learner_id: 125,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-25",
            score: 47
        }
    },
    {
        learner_id: 125,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-02-12",
            score: 150
        }
    },
    {
        learner_id: 125,
        assignment_id: 3,
        submission: {
            submitted_at: "2023-03-16", 
            score: 400
        }
    },
    {
        learner_id: 132,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-24",
            score: 39
        }
    },
    {
        learner_id: 132,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-03-07",
            score: 140
        }
    }
];

function getLearnerData(CourseInfo, assignmentGroup, submissions) {
    try {
        // Validate that assignment group belongs to the course
        if (assignmentGroup.course_id !== CourseInfo.id) {
            throw new Error("Invalid Assignment Group: Course ID does not match.");
        }

        const results = [];
        const learnerData = {};

        // Iterate through submissions to collect data
        for (const submission of submissions) {
            const { learner_id, assignment_id, submission: { submitted_at, score } } = submission;
            const assignmentLog = assignmentGroup.assignments.find(a => a.id === assignment_id);

            // Check if assignment exists
            if (!assignmentLog) {
                console.error(`Assignment with ID ${assignment_id} does not exist.`);
                continue; // Skip further processing for this submission
            }

            const { due_at, points_possible } = assignmentLog;

            // Validate points_possible
            if (typeof points_possible !== 'number' || points_possible <= 0) {
                console.error(`Invalid points_possible for assignment ID ${assignment_id}.`);
                continue; // Skip further processing for this submission
            }

            let finalScore = score;
            // Only process assignments that are due
            if (new Date(submitted_at) > new Date(due_at)) {
                finalScore *= 0.9; // 10% deduction for late submission
            }

            // Initialize learner data if not exists
            if (!learnerData[learner_id]) {
                learnerData[learner_id] = {
                    totalScore: 0,
                    totalPoints: 0,
                    individualScores: {}
                };
            }

            // Update scores
            learnerData[learner_id].totalScore += finalScore;
            learnerData[learner_id].totalPoints += points_possible;
            learnerData[learner_id].individualScores[assignment_id] = finalScore / points_possible;
        }

        // Calculate average for each learner
        for (const learner_id in learnerData) {
            const { totalScore, totalPoints, individualScores } = learnerData[learner_id];

            // Avoid division by zero
            const avg = totalPoints > 0 ? totalScore / totalPoints : 0;

            results.push({
                id: Number(learner_id),
                avg: avg,
                individualScores
            });
        }

        return results;

    } catch (error) {
        console.error(`Error: ${error.message}`);
        return [];
    }
}

const learnerData = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
console.log(learnerData);
