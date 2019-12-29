import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {

  @Input()
  description: string = "Your logo will help you colleagues and others to recognize your brand much better.";


}
