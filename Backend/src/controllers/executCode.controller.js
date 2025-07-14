import { decodeBase64 } from "bcryptjs";

import { getLanguageName, pollBatchResults, submitBatch } from "../libs/judge0.lib.js";



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
            return res.ststus(404).json({error:"Invalid or missing test cases"})
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


        console.log("result-------->", results);

        let allPassed = true;

// 5 return result
        const detailedResult = results.map((result, i) => {
            const stdout = result.stdout?.trim();
            const expectedOutput = exepected_outputs[i]?.trim();
            const passed = stdout === expectedOutput;

            if(!passed) allPassed = false;

            return {
                testcase: i + 1,
                passed,
                stdout,
                expected: expectedOutput,
                stderr: result.stderr || null,
                compileOutput: result.compile_output || null,
                status: result.status.description,
                memory: result.memory ? `${result.memory} kB`: undefined,
                time: result.time ? `${result.time} ms` : undefined
            };
        });
        
        console.log(detailedResult);
        
        res.status(200).json({
            message: "code executed",
            allPassed,
            testResults: detailedResult,
            summary: {
                total: detailedResult.length,
                passed: detailedResult.filter(test => test.passed).length,
                failed: detailedResult.filter(test => !test.passed).length
            }
        })

        // 6 save submission
        const submission = await db.submission.create({
            data:{
                userId,
                problemId: problemid,
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
                    userId_problemId:{
                        userId, problemId: problemid
                    }
                },
                update:{},
                create:{
                    userId,
                    problemId: problemid
                }
            })

        }
       // 8 save individul test case result
       const TastCaseResult = detailedResult.map((result) => ({
           submissionId: submission.id,
           testcase: result.testcase,
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

     const submissionwithTastcase = await db.submission.findUnique({
        weher:{
            id: submission.id
        },
        include: {
            TastCaseResult: true
        }
     })
     res.status(200).json({
        success: true,
        massage:"code executed successfully!",
        submission: submissionwithTastcase
     })
     
     } catch (error) {
        console.log("executCode fail");
        res.status(404).json({
            error: "code  execute fail"
        })

    }

}