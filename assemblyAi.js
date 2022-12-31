const axios = require("axios")
const fs = require("fs/promises");

const API_KEY = process.env.API_KEY;
const ASSEMBLY_BASE_URL = process.env.ASSEMBLY_BASE_URL

class AssemblyAi {

    async uploadLocalFile(path) {
        const assembly = axios.create({
            baseURL: ASSEMBLY_BASE_URL,
            headers: {
                authorization: API_KEY,
                "content-type": "application/json",
                "transfer-encoding": "chunked",
            },
        });


        const file = path;
        const data = await fs.readFile(file)
        const response = await assembly
            .post("/upload", data);

        return response.data;
    }

    async transcribe(fileURL, languageCode = 'pt') {
        const assembly = axios.create({
            baseURL: ASSEMBLY_BASE_URL,
            headers: {
                authorization: API_KEY,
                "content-type": "application/json",
            },
        });


        const response = await assembly
            .post("/transcript", {
                audio_url: fileURL,
                language_code: languageCode
            })

        return response.data;
    }

    async getTranscriptionGenerated(idTranscribeProcess) {
        const assembly = axios.create({
            baseURL: ASSEMBLY_BASE_URL,
            headers: {
                authorization: API_KEY,
                "content-type": "application/json",
            },
        });

        const response = await assembly
            .get(`/transcript/${idTranscribeProcess}`)

        return response.data;
    }
}

module.exports = AssemblyAi