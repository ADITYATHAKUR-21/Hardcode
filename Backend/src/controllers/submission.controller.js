import { db } from "../libs/db.js"


export const getAllSubmission = async (req, res) => {
    try {
        const userId = req.user.id;

        const submission = await db.submission.findMany({
            where: {
                userId:  userId
            }

        }) 
        

        res.status(200).json({
            success: true,
            massage: "Submissions fatched successfully",
            submission
        })
    } catch (error) {
        console.log("error: Submissions fatching erorr");
        res.status(500).json({
            massage: "fail to fatch submissions"
        })
        
    }
}

export const getSubmissionsForProblem = async (req, res) => {
    try {

        const userId = req.user.id;
        const problemId = req.params.problemId;

        const submissions = await db.submission.findmany({
            where:{
                userId: userId,
                problemId: problemId
            }
        })

        res.status(200).json({
            success: true,
            massage: "Submissions fatched successfully",
            submissions
        })

        
    } catch (error) {
        console.log("error: Submissions fatching erorr");
        res.status(500).json({
            massage: "fail to fatch submissions"
        })
        
    }
}


export const getAllTheSubmissionsForProblem = async (req, res) => {
    try {
        const problemId = req.params.problemId;

        const submission =  await db.submission.count({
            where:{
                problemId: problemId
            }

        })

        res.status(200).json({
            success: true,
            massage: "submissions fatched successfully",
            count: submission
        })
        
    } catch (error) {
        console.log("error: Submissions fatching erorr");
        res.status(500).json({
            massage: "fail to fatch submissions"
        })
    }

}