import { decodeBase64 } from "bcryptjs";

import { getLanguageName, pollBatchResults, submitBatch } from "../libs/judge0.lib.js";
import { db } from "../libs/db.js"; // Add missing db import



export const executCode = async (req,res) => {
    try {
        const {source_code, language_id, stdin, exepected_outputs, problemid} = req.body;

        if(!source_code, !language_id, !stdin, !exepected_outputs, !problemid){
            return res.status(404).json({
                error: "all field are required"
            })
        }

        const userId = req.user.id;

         // 1 validate test cases

        if(
            !Array.isArray(stdin) || !stdin.length === 0 || !Array.isArray(exepected_outputs)
            || exepected_outputs.length !== stdin.length
        ){
            return res.status(404).json({error:"Invalid or missing test cases"})
        }

        // 2 perper each test cases for judeg 0 batch submission

        const submissions = stdin.map((input) =>({
            source_code,
            language_id,
            stdin: input,
            base64_encoded: false,
            wait: false

        }));

        // 3 send batch of sumissions to judeg0

        const submitResponse = await submitBatch(submissions);

        const tokens = submitResponse.map((res) => res.token)

        // 4 pull judeg0 for result of  all submited tast cases

        const results = await pollBatchResults(tokens);


        console.log("result------->", JSON.stringify(results, null, 2));

        let allPassed = true;

// 5 return result
        const detailedResult = results.map((result, i) => {
            console.log(`Processing test case ${i + 1}:`, {
                stdout: result.stdout,
                stderr: result.stderr,
                status: result.status,
                expected: exepected_outputs[i]
            });
            
            const stdout = result.stdout !== null && result.stdout !== undefined ? result.stdout.trim() : '';
            const expectedOutput = exepected_outputs[i] ? exepected_outputs[i].trim() : '';
            const passed = stdout === expectedOutput;

            if(!passed) {
                allPassed = false;
                console.log(`Test case ${i + 1} failed:`, {
                    actual: stdout,
                    expected: expectedOutput,
                    actualType: typeof stdout,
                    expectedType: typeof expectedOutput,
                    rawStdout: result.stdout,
                    rawStdoutType: typeof result.stdout
                });
            }

            return {
                testcase: i + 1,
                passed,
                stdout: stdout || null,
                expected: expectedOutput,
                stderr: result.stderr || null,
                compileOutput: result.compile_output || null,
                status: result.status.description,
                memory: result.memory ? `${result.memory} kB`: undefined,
                time: result.time ? `${result.time} ms` : undefined
            };
        });
        
        console.log(detailedResult);
        
        // 6 save submission
        const submission = await db.submission.create({
            data:{
                userid: userId,
                problemid: problemid,
                sourceCode: source_code,
                language: getLanguageName(language_id),
                stdin: stdin.join("\n"),
                stdout:JSON.stringify(detailedResult.map((r) => r.stdout)),
                stderr: detailedResult.some((r) => r.stderr)
                ? JSON.stringify(detailedResult.map((r) => r.stderr))
                : null,
                compileOutput: detailedResult.some((r) => r.compileOutput)
                ? JSON.stringify(detailedResult.map((r) => r.compileOutput))
                : null,
                status:allPassed ? "accepted" : "wrong answer",
                memory: detailedResult.some((r) => r.memory)
                ? JSON.stringify(detailedResult.map((r) => r.memory))
                : null,
                time: detailedResult.some((r) => r.time)
                ? JSON.stringify(detailedResult.map((r) => r.time))
                : null
            }
        })

       // 7 save problem solved
        if(allPassed){
            await db.problemSolved.upsert({
                where: {
                    userid_problemid:{
                        userid: userId, problemid: problemid
                    }
                },
                update:{},
                create:{
                    userid: userId,
                    problemid: problemid
                }
            })

        }
       // 8 save individul test case result
       const TastCaseResult = detailedResult.map((result) => ({
           submissionid: submission.id,
           testcases: result.testcase,
           passed: result.passed,
           stdout: result.stdout,
           expected: result.expected,
           stderr: result.stderr,
           compileOutput: result.compileOutput,
           status: result.status,
           memory: result.memory,
           time: result.time
       }))

     await db.TastCaseResult.createMany({
        data: TastCaseResult
     })

     res.status(200).json({
        success: true,
        message: "code executed successfully!",
        allPassed,
        testResults: detailedResult,
        summary: {
            total: detailedResult.length,
            passed: detailedResult.filter(test => test.passed).length,
            failed: detailedResult.filter(test => !test.passed).length
        },
        submissionId: submission.id
     })
     
     } catch (error) {
        console.log("executCode fail - Error details:", error);
        console.log("Error stack:", error.stack);
        res.status(500).json({
            error: "code execute fail",
            details: error.message
        })

    }

}