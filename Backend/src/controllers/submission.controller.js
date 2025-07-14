import { db } from "../libs/db.js"


export const getAllSubmission = async (req, res) => {
    try {
        const userId = req.user.id;

        const submission = await db.submission.findMany({
            where: {
                userid:  userId
            }

        })
        

        res.status(200).json({
            success: true,
            message: "Submissions fetched successfully",
            submission
        })
    } catch (error) {
        console.log("error: Submissions fetching error", error);
        res.status(500).json({
            message: "fail to fetch submissions"
        })
        
    }
}

export const getSubmissionsForProblem = async (req, res) => {
    try {

        const userId = req.user.id;
        const problemId = req.params.problemId;

        const submissions = await db.submission.findMany({
            where:{
                userid: userId,
                problemid: problemId
            }
        })

        res.status(200).json({
            success: true,
            message: "Submissions fetched successfully",
            submissions
        })

        
    } catch (error) {
        console.log("error: Submissions fetching error");
        res.status(500).json({
            message: "fail to fetch submissions"
        })
        
    }
}


export const getAllTheSubmissionsForProblem = async (req, res) => {
    try {
        const problemId = req.params.problemId;

        const submission =  await db.submission.count({
            where:{
                problemid: problemId
            }

        })

        res.status(200).json({
            success: true,
            message: "submissions fetched successfully",
            count: submission
        })
        
    } catch (error) {
        console.log("error: Submissions fetching error");
        res.status(500).json({
            message: "fail to fetch submissions"
        })
    }

}