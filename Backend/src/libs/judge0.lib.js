import axios from "axios";

export const getjudge0LanguageId = (language) => {
    const languageMap = {
        'c': 50,
        'cpp': 54,
        'java': 62,
        'python': 71,
        'javascript': 63,
    };
    return languageMap[language.toLowerCase()] 
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


export const pollBatchResults = async (tokens) => {
    while (true) {
        

                
        const {data} = await axios.request({
            method:'GET',
            url:`${process.env.SULU_API_URL}/submissions/batch`,
            params: {
                tokens:tokens.join(","),
                base64_encoded: 'false',
            },
            headers:{
                Accept:'application/json',
                Authorization: process.env.SULU_API_KEY
            }
        })

        const results = data.submissions;

        const isAllDone = results.every(
            (result) => result.status.id !== 1 && result.status.id !== 2)

        if (isAllDone) return results;
        await sleep (1000);

    }
}

export const submitBatch = async (submissions) => {
    const {data} = await axios.request({
        method:'POST',
        url:`${process.env.SULU_API_URL}/submissions/batch`,
        params: {base64_encoded: 'false'},
        headers:{
            'Content-Type':'application/json',
            Accept:'application/json',
            Authorization: process.env.SULU_API_KEY
        },
        data:{
            submissions
        }
    })

    console.log("submissions results", data);

    return data;
}
