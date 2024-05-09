import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FileHandle } from './drag-drop.directive';

@Injectable({
  providedIn: 'root'
})
export class ExtractFileService {

  private fileSubject = new BehaviorSubject<FileHandle | null>(null);
  public file$ = this.fileSubject.asObservable();

  sendFile(file: FileHandle): void {
    this.fileSubject.next(file);
  }

  extractAndSendFile(file: FileHandle): void {


  }
}




/*


// Replace with your Google Cloud Vision API key
const apiKey = 'YOUR_API_KEY';

async function solveCaptchaWithCloudVision(base64String: string): Promise<any> {
    const ocrRequestBody = {
        requests: [
            {
                image: {
                    content: base64String,
                },
                features: [
                    {
                        type: 'DOCUMENT_TEXT_DETECTION',
                    },
                ],
            },
        ],
    };

    try {
        const response = await fetch(
            `https://content-vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
            {
                body: JSON.stringify(ocrRequestBody),
                method: "POST",
            }
        );

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const results = data.responses;
        return results;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

function extractData(text: string, data1: string): any {
    console.log("data1: ", data1);
    const data: any = {};
    const dates = text.match(/\d{2}\/\d{2}\/\d{4}/g).sort();
    data.dob = dates[0];
    data.doi = dates[1];
    data.doe = dates[2];

    data.prefecture = text.match(/PREFECTURE[\s\S]*?\n/)[0].split('PREFECTURE')[1].trim();

    data.firstName = data1.trim().split('<<')[1];
    data.lastName = data1.trim().split('<<')[0].split('<')[1].replace("MAR", ' ');
    data.Npass = data1.trim().split('<<<<<<<<<<<<<')[1].split('MAR')[0].split('\n')[1].slice(0, -1);
    data.cin = data1.trim().split('<<<<<<<');
    data.cin = data.cin[data.cin.length - 2].split('MAR')[1].slice(-7);
    if (data.cin[6] < 'A' || data.cin[6] > 'Z') {
        data.cin = data.cin.slice(1, 7);
    }
    return data;
}

async function main() {
    try {
        const base64 = fs.readFileSync(path.resolve(__dirname, './test1.jpeg'), 'base64');
        const res = await solveCaptchaWithCloudVision(base64);
        const text = res[0].fullTextAnnotation.text.split('\n').slice(-2).join('\n');
        console.log(extractData(res[0].fullTextAnnotation.text, text));
    } catch (error) {
        console.error('Error:', error);
    }
}

main();




*/