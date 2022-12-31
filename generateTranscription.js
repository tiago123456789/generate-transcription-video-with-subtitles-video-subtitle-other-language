require("dotenv").config()
const fs = require("fs/promises");
const AssemblyAi = require("./assemblyAi");

async function generateSubtitles() {
    try {
        const transcriberService = new AssemblyAi();
        console.log("Uploading audio or video to next step make transcription")
        const data = await transcriberService.uploadLocalFile("./king-crab.mp4")
        console.log("Sending data for execute transcription of audio ou video")
        const transcribeProcessReturned = await transcriberService.transcribe(
            data.upload_url, "pt"
        )
    
        console.log("Waiting transcription process finish to generate subtitle file")
        setTimeout(async () => {
            const transcription = await transcriberService.getTranscriptionGenerated(
                transcribeProcessReturned.id
            );

            console.log("Saving transcription to the audio ou video")
            await fs.writeFile("transcription.txt", transcription.text)
            console.log("Finished process.")
        }, 30000)

    } catch(error) {
        console.log(error)
    }
    
}

generateSubtitles()