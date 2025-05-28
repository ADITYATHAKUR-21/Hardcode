import { db } from '../libs/db.js';
import { getjudge0LanguageId, pollBatchResults, submitBatch } from '../libs/judge0.lib.js';

export const createProblem = async (req, res) => {
    try {
        // Get all data from the request body
        const { title, description, difficulty, tags, example, constraints, testcases, codeSnippets, referencesSolutions } = req.body;
        
        // Validate required fields
        if (!title || !description || !difficulty || !testcases || !referencesSolutions) {
            return res.status(400).json({ 
                message: 'Missing required fields. Please provide title, description, difficulty, testcases, and referencesSolutions' 
            });
        }
        
        // Validate testcases structure
        if (!Array.isArray(testcases) || testcases.length === 0) {
            return res.status(400).json({ message: 'Testcases should be a non-empty array' });
        }
        
        for (const testcase of testcases) {
            if (!testcase.input || !testcase.output) {
                return res.status(400).json({ message: 'Each testcase must have input and output fields' });
            }
        }
        
        // Validate reference solutions
        if (typeof referencesSolutions !== 'object' || Object.keys(referencesSolutions).length === 0) {
            return res.status(400).json({ message: 'Reference solutions should be a non-empty object' });
        }
        
        // Check if JUDGE0_API_URL is configured
        if (!process.env.JUDGE0_API_URL) {
            return res.status(500).json({ message: 'Judge0 API URL is not configured' });
        }
        
        // Verify each reference solution against all testcases
        const verificationResults = {};
        
        for (const [language, solution] of Object.entries(referencesSolutions)) {
            // Get language ID for Judge0
            const languageId = getjudge0LanguageId(language);
            if (!languageId) {
                return res.status(400).json({ message: `Unsupported language: ${language}` });
            }
            
            // Create submissions for each testcase
            const submissions = testcases.map(({ input, output }) => ({
                source_code: solution,
                language_id: languageId,
                stdin: input,
                expected_output: output
            }));
            
            // Submit batch for execution
            const submissionResults = await submitBatch(submissions);
            
            // Extract tokens for polling
            const tokens = submissionResults.map((res) => res.token);
            
            // Poll for results
            const results = await pollBatchResults(tokens);
            
            // Verify all testcases passed
            verificationResults[language] = { passed: true, failedTestcase: null };
            
            for (let i = 0; i < results.length; i++) {
                const result = results[i];
                console.log(`Result for ${language}, testcase ${i+1}:`, result);
                
                if (result.status.id !== 3) { // 3 = Accepted
                    verificationResults[language] = { 
                        passed: false, 
                        failedTestcase: i + 1,
                        status: result.status
                    };
                    break;
                }
            }
            
            // If any testcase failed, return error
            if (!verificationResults[language].passed) {
                return res.status(400).json({
                    message: `Testcase ${verificationResults[language].failedTestcase} failed for language ${language}`,
                    status: verificationResults[language].status
                });
            }
        }
        
        // All reference solutions passed all testcases, save problem to database
        const newProblem = await db.problem.create({
            data: {
                title,
                description,
                difficulty,
                tags,
                example,
                constraints,
                testcases,
                codeSnippets,
                referencesSolutions,
                userId: req.user.id
            }
        });
        
        return res.status(201).json({
            message: 'Problem created successfully',
            problem: newProblem
        });
        
    } catch (error) {
        console.error('Error creating problem:', error);
        return res.status(500).json({ 
            message: 'An error occurred while creating the problem',
            error: error.message 
        });
    }
}


export const getallproblems = async (req, res) => {}


export const getProblemById = async (req, res) => {} 


export const updateProblem = async (req, res) => {}


export const deleteProblem = async (req, res) => {}


export const getallproblemsSolvedbyUser = async (req, res) => {}