import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {AfterViewInit, Component, Inject, Input} from '@angular/core';
import {CreateEntryGQL, EntryType} from "../../../generated/abis-api";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-create-entry-editor',
  templateUrl: './create-entry-editor.component.html',
  styleUrls: ['./create-entry-editor.component.css']
})
export class CreateEntryEditorComponent implements AfterViewInit{

  @Input()
  public inGroupId:string;
  @Input()
  public contentEncodingId:string;

  jsonSchema:any;

  constructor(
      private userService: UserService
    , private createEntry: CreateEntryGQL
    , private dialogRef: MatDialogRef<CreateEntryEditorComponent>,
      @Inject(MAT_DIALOG_DATA) data) {
    this.inGroupId = data.inGroupId;
    this.contentEncodingId = data.contentEncodingId;
  }

  ngAfterViewInit(): void {
    if (!this.inGroupId || !this.contentEncodingId) {
      throw new Error("Either the 'inGroupId' or the 'contentEncodingId' property is not set on AfterViewInit.");
    }
    const contentEncoding = this.userService.contentEncodings.find(o => o.id == this.contentEncodingId);
    this.jsonSchema = JSON.parse(contentEncoding.data);
  }

  async onSubmit($event: any) {
    await this.createEntry.mutate({
      csrfToken: this.userService.csrfToken,
      createEntryInput: {
        roomId: this.inGroupId,
        content: $event,
        contentEncoding: this.contentEncodingId,
        name: new Date().toISOString(),
        type: EntryType.Json
      }
    }).toPromise();
    this.dialogRef.close();
  }
}
