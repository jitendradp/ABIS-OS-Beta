import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {

  picInputChange(fileInputEvent: any) {
    console.log(fileInputEvent.target.files[0]);
  }

  @Input()
  buttonTitle: string = "Choose your picture";

}
