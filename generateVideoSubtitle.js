require("dotenv").config()
const { exec } = require("child_process");
const AssemblyAi = require("./assemblyAi");
const Transcriptor = require("./transcriptor");

async function generateSubtitles() {
    try {
        const transcriptor = new Transcriptor()
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

            const pathSubtitles = "./subtitle_test.srt"
            const input = "./king-crab.mp4"
            const output = "./king-crab-subtitles.mp4"

            console.log("Generating subtitles for audio or video uploaded")
            await transcriptor.saveOriginalTranscription(
                transcription, pathSubtitles
            )
            console.log("Generated subtitles for audio or video uploaded")
            console.log("Generating video with subtitle into the video")
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