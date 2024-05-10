import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FileHandle } from './drag-drop.directive';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExtractFileService {
    private fileSubject = new BehaviorSubject<FileHandle | null>(null);
    public file$ = this.fileSubject.asObservable();

    constructor(private http:HttpClient) { }

    extractFile(fileHandle: FileHandle){
      
      const formData = new FormData();
      formData.append('image', fileHandle.file);

      return this.http.post('http://192.168.11.125:3000/image-to-json', formData)

    }

    sendFile(file: FileHandle): void {
        this.fileSubject.next(file);
    }

}
