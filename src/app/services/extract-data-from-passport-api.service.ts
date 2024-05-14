import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExtractDataFromPassportApiService {
  private apiKey: string = 'AIzaSyC0FKuOzxye6eM00l9ToAPlEpwk-S67ZrM';

  constructor(private http: HttpClient) { }

  async solveCaptchaWithCloudVision(base64String: string): Promise<any> {
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
      const response = await this.http.post<any>(
        `https://content-vision.googleapis.com/v1/images:annotate?key=${this.apiKey}`,
        ocrRequestBody
      ).toPromise();
      console.log(response);
      return response;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  }

  async extractData(text: string, data1: string): Promise<any> {
    const data: any = {};
    let dates: RegExpMatchArray = text.match(/\d{2}\/\d{2}\/\d{4}/g);

    if (dates) {
      var sort = dates.map(dateString => {
        const [day, month, year] = dateString.split('/');
        return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
      });

      sort.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

      data.dob = this.formatDate(new Date(sort[0]));
      data.doi = this.formatDate(new Date(sort[1]));
      data.doe = this.formatDate(new Date(sort[2]));
    }

    const prefectureMatch = text.match(/(PREFECTURE|PROVINCE)[\s\S]*?\n/);
    if (prefectureMatch) {
      data.prefecture = prefectureMatch[0].split('PREFECTURE')[1].replace('DE ', '').trim();
    }

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

  removeDuplicateChars(inputString: string, charToRemove: string): string {
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

  async main(file: File): Promise<any> {
    const base64 = await this.convertFileToBase64(file);
    try {
      const res = await this.solveCaptchaWithCloudVision(base64);
      const text = res.responses[0].fullTextAnnotation.text.split('\n').slice(-2).join('');
      const cleanedText = this.removeDuplicateChars(text, '<');
      return await this.extractData(res.responses[0].fullTextAnnotation.text, cleanedText);
    } catch (error) {
      return null;
    }
  }

  private async convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result?.toString().split(',')[1];
        if (base64String) {
          resolve(base64String);
        } else {
          reject('Error converting file to base64');
        }
      };
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    })
  }
}
