import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FileHandle } from './drag-drop.directive';

@Injectable({
  providedIn: 'root'
})
export class ExtractFileService {
    private fileSubject = new BehaviorSubject<FileHandle | null>(null);
    public file$ = this.fileSubject.asObservable();

    constructor(private injector: Injector) { }

    sendFile(file: FileHandle): void {
        this.fileSubject.next(file);
    }

}
