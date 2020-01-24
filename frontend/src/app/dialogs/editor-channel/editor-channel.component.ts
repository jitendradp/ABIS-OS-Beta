import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-editor-channel',
  templateUrl: './editor-channel.component.html',
  styleUrls: ['./editor-channel.component.css']
})
export class EditorChannelComponent {


  constructor(
    public dialogRef: MatDialogRef<EditorChannelComponent>) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
