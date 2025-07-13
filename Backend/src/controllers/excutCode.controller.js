import { decodeBase64 } from "bcryptjs";
import {db} from "../libs/db.js"
import { pollBatchResults, submitBatch } from "../libs/judge0.lib.js";



export const executCode = async (req,res) => {
    try {
        const {source_code, language_id, stdin, exepected_outputs, problemid} = req.body;

        if(!source_code, !language_id, !stdin, !exepected_outputs, !problemid){
            return res.status(404).json({
                error: "all field are required"
            })
        }

        const userId = req.user.id;

         // validate test cases

        if(
            !Array.isArray(stdin) || !stdin.length === 0 || !Array.isArray(exepected_outputs)
            || exepected_outputs.length !== stdin.length
        ){
            return res.ststus(404).json({error:"Invalid or missing test cases"})
        }

        // perper each test cases for judeg 0 batch submission

        const submissions = stdin.map((input) =>({
            source_code,
            language_id,
            stdin: input,
            base64_encoded: false,
            wait: false

        }));

        // send batch of sumissions to judeg0

        const submitResponse = await submitBatch(submissions);

        const tokens = submitResponse.map((res) => res.token)

        // pull judeg0 for result of  all submited tast cases

        const results = await pollBatchResults(tokens);


        console.log("result-------->");
        
        res.status(200).json({
            massage: "code executed"
        })



     } catch (error) {
        console.log("executCode fail");
        res.status(404).json({
            error: "code  execute fail"
        })

    }

}