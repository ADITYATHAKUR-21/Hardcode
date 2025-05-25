import { db } from '../libs/db.js';
import { pollBatchResults } from '../libs/judge0.lib.js';
export const createProblem = async (req, res) => {
    // going to get the all data from the request body
    const{ title, description, difficulty, tags, example, constraints, testcases, codeSnippets, referencesSolutions} = req.body;
    // going to check the user role once again
    if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'You are not allow to create problems.' });
    }

    try {
        for(const [language , solution] of Object.entries(referencesSolutions)) {
            const languageId =  getjudge0LanguageId(language);
            if (!languageId) {
                return res.status(400).json({ Error: `Unsupported language: ${language}` });
            }

       

        const submission = testcases.map(({input, output}) => ({
            source_code: solutionCode,
            language_id: languageId,
            stdin: input,
            expected_output: output,


        }))
         
        const submissionResults = await submitBatch(submission);

        const token = submissionResults.map((res) => res.token);

        const results = await pollBatchResults(token);

        for (let i=0 < results.length; i++;){
            const result = result[i];

            if (result.status.id !== 3) {
                return res.status(400).json({Error: `testcase ${i+1} failed for language ${language}`});
            }

        }
        // Save the problem to the database
        const newproblem = await db.problem.create ({
            data : {title, description, difficulty, tags, example, constraints, testcases, codeSnippets, referencesSolutions,
                 userId: req.user.id}
        })

        return res.status(201).json({ message: 'Problem created successfully', problem: newproblem });
   

    }
    } catch (error) {
        
    }
    // Loop through each reference solution for differnt languages
    
}


export const getallproblems = async (req, res) => {}


export const getProblemById = async (req, res) => {} 


export const updateProblem = async (req, res) => {}


export const deleteProblem = async (req, res) => {}


export const getallproblemsSolvedbyUser = async (req, res) => {}