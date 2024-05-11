import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';

// Replace with your Google Cloud Vision API key
const apiKey: string = 'AIzaSyC0FKuOzxye6eM00l9ToAPlEpwk-S67ZrM';

async function solveCaptchaWithCloudVision(base64String: string) {
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
      "https://content-vision.googleapis.com/v1/images:annotate?alt=json&key=" + apiKey,
      {
        body: JSON.stringify(ocrRequestBody),
        method: "POST",
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

function formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
}

// Function to extract specific data
async function extractData(text: string, data1: string): Promise<any> {
    console.log('data1: ', data1);
    const data: any = {};
    let dates: RegExpMatchArray = text.match(/\d{2}\/\d{2}\/\d{4}/g);

    if (dates) {
        var sort = dates.map(dateString => {
            const [day, month, year] = dateString.split('/');
            return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
        });

        sort.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

        data.dob = formatDate(new Date(sort[0]));
        data.doi = formatDate(new Date(sort[1]));
        data.doe = formatDate(new Date(sort[2]));
    }

    // get line starting with "PREFECTURE" and extract the prefecture name
    const prefectureMatch = text.match(/(PREFECTURE|PROVINCE)[\s\S]*?\n/);
    if (prefectureMatch) {
        data.prefecture = prefectureMatch[0].split('PREFECTURE')[1].replace('DE ', '').trim();
    }

    // get all the names in the text
    const trimmedData = data1.trim();
    data.firstName = trimmedData.split('<')[2];
    data.lastName = trimmedData.split('<')[1].replace('MAR', ' ');
    const NpassAndCIN = trimmedData.split('<')[3].split('MAR');
    data.Npass = NpassAndCIN[0].slice(0, -1);
    data.cin = NpassAndCIN[1].slice(-8);

    if (data.cin[0] < 'A' || data.cin[0] > 'Z') {
        if (data.cin[0] < 'A' || data.cin[0] > 'Z') {
            data.cin = data.cin.slice(2, 8);
        } else {
            data.cin = data.cin.slice(1, 8);
        }
    }
    return data;
}

function removeDuplicateChars(inputString: string, charToRemove: string): string {
    let outputString = '';
    let prevChar: string | null = null;

    for (const char of inputString) {
        if (char !== charToRemove || char !== prevChar) {
            outputString += char;
            prevChar = char;
        }
    }

    return outputString;
}

export async function main(filename: string) {
  const base64 = fs.readFileSync(path.resolve('./public/', filename), 'base64');
  try {
    const res = await solveCaptchaWithCloudVision(base64);
    const text = res.responses[0].fullTextAnnotation.text.split('\n').slice(-2).join('');
    const cleanedText = removeDuplicateChars(text, '<');
    // delete the image after processing
    fs.unlinkSync(path.resolve('./public/', filename));
    return await extractData(res.responses[0].fullTextAnnotation.text, cleanedText);
  } catch (error) {
    return null
  }
};

export default main;