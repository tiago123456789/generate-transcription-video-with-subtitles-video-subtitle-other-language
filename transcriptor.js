const AWS = require("aws-sdk");
const fs = require("fs/promises");
const srtConvert = require('aws-transcription-to-srt')
const credentials = new AWS.SharedIniFileCredentials({ profile: 'default' });

AWS.config.credentials = credentials;
AWS.config.update({ region: "us-east-1" });

class Transcriptor {

    constructor() {
        this.translate = new AWS.Translate();
    }

    saveOriginalTranscription(transcription, filename) {
        const subtitlesStructuredToGenerateSRT = transcription.words.map(item => {
            return {
                start_time: item.start / 1000,
                end_time: item.end / 1000,
                alternatives: [
                    {
                        confidence: item.confidence,
                        content: item.text
                    }
                ],
            }
        })

        const srt = srtConvert({
            results: {
                items: subtitlesStructuredToGenerateSRT
            }
        })

        return fs.writeFile(filename, `WEBVTT FILE\n\n${srt}`)
    }


    async saveTranscriptionInOtherLanguage(transcription, filename, languageFrom, languageTo) {
        const items = [];

        for (let index = 0; index < transcription.words.length; index += 1) {
            const item = transcription.words[index];

            items.push({
                start_time: item.start / 1000,
                end_time: item.end / 1000,
                alternatives: [
                    {
                        confidence: item.confidence,
                        content: item.text
                    }
                ],
            })
        }

        const srt = srtConvert({
            results: {
                items: items
            }
        })

        const textExtracted = srt.split("\n")
        let text = ""
        for (let index = 2; index < textExtracted.length; index += 4) {
            text += `${textExtracted[index - 2]}\n`
            text += `${textExtracted[index - 1]}\n`

            const params = {
                SourceLanguageCode: languageFrom,
                TargetLanguageCode: languageTo,
                Text: textExtracted[index]
            };
    
            let textTranslated = await this.translate.translateText(params).promise();
            textTranslated = textTranslated.TranslatedText;

            text += `${textTranslated}\n\n`
        }

        return fs.writeFile(filename, `WEBVTT FILE\n\n${text}`)
    }

}

module.exports = Transcriptor;