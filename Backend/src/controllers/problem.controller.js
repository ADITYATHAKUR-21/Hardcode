import { db } from '../libs/db.js';
import { getjudge0LanguageId, pollBatchResults, submitBatch } from '../libs/judge0.lib.js';

export const createProblem = async (req, res) => {

    const { title, description, difficulty, tags, example, constraints, hints, editorial, testcases,
         codeSnippets, referencesSolutions, } = req.body;


if(req.user.role !== "ADMIN"){
  return res.status(403).json({error : "Only admin allow  create a problem"})
}

// Validate required fields
if (!title || !description || !difficulty || !tags || !example || !constraints || !editorial || !testcases || !codeSnippets || !referencesSolutions) {
  return res.status(400).json({error: "All required fields must be provided: title, description, difficulty, tags, example, constraints, editorial, testcases, codeSnippets, referencesSolutions"})
}

try {
  // Validate all reference solutions first
  for(const [language, solutioncode] of Object.entries (referencesSolutions)){

    const languageId = getjudge0LanguageId(language);

    const submissions = testcases.map(({input, output}) => ({
      source_code: solutioncode,
      language_id: languageId,
      stdin: input,
      expected_output: output
    }))
    const submissionsResult = await submitBatch(submissions)
    const tokens = submissionsResult.map((res)=> res.token);
    const result = await pollBatchResults(tokens);

    for(let i = 0; i < result.length; i++){
      const testResult = result[i];

      if(testResult.status.id !== 3){
        return res.status(400).json({error :`testcase ${i+1} failed for language ${language}`});
      }
    }
  }

  // If all validations pass, create the problem
  const newProblem = await db.problem.create({
    data: {
      title,
      description,
      difficulty,
      tags,
      example,
      constraints,
      hints,
      editorial,
      testcases,
      codeSnippets,
      referencesSolutions,
      userid : req.user.id,
    }
  })
  
  return res.status(200).json({message: "problem created successfully" })
  
} catch (error) {
  console.error("error creating problem", error);
  res.status(500).json({
    error: "creating problem error"
  })
}




}

   

export const getAllproblems = async (req, res) => {}


export const getProblemById = async (req, res) => {} 


export const updateProblem = async (req, res) => {}


export const deleteProblem = async (req, res) => {}


export const getAllproblemsSolvedbyUser = async (req, res) => {}