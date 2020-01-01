import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-channel-editor',
  templateUrl: './channel-editor.component.html',
  styleUrls: ['./channel-editor.component.css']
})
export class ChannelEditorComponent {


  constructor(
    public dialogRef: MatDialogRef<ChannelEditorComponent>) {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
