require("dotenv").config()
const { exec } = require("child_process");

const AssemblyAi = require("./assemblyAi");
const Transcriptor = require("./transcriptor")

async function generateSubtitles() {
    try {
        const pathOriginalFile = "./food-short.mp4"
        const transcriptor = new Transcriptor();
        const assemblyAiService = new AssemblyAi();
        console.log("Uploading audio or video to next step make transcription")
        const data = await assemblyAiService.uploadLocalFile(pathOriginalFile)
        console.log("Sending data for execute transcription of audio ou video")
        const transcribeProcessReturned = await assemblyAiService.transcribe(
            data.upload_url, "pt"
        )

        console.log("Waiting transcription process finish to generate subtitle file")
        setTimeout(async () => {
            const transcription = await assemblyAiService.getTranscriptionGenerated(
                transcribeProcessReturned.id
            );
            const pathSubtitles = "./subtitle_en.srt"
            
            console.log("Generating subtitles for audio or video uploaded")
            await transcriptor.saveTranscriptionInOtherLanguage(
                transcription, pathSubtitles, "pt", "en"
            )

            console.log("Generated subtitles for audio or video uploaded")
            console.log("Generating video with subtitle into the video")
            const input = pathOriginalFile
            const output = "./food-short-subtitles.en.mp4"
            exec(
                `ffmpeg -i ${input} -vf subtitles="${pathSubtitles}" "${output}" -y`,
                (error, stdout, stderr) => {
                    if (error) {
                        console.log(error)
                    }

                    if (stderr) {
                        console.log(stderr)
                    }

                    if (stdout) {
                        console.log(stdout)
                    }
                }
            )
        }, 30000)
    } catch (error) {
        console.log(error)
    }
}

generateSubtitles()