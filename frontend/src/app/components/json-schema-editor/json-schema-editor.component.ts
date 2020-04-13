import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-json-schema-editor',
  templateUrl: './json-schema-editor.component.html',
  styleUrls: ['./json-schema-editor.component.css']
})
export class JsonSchemaEditorComponent {
  @Input()
  public jsonSchema:any;
  @Output()
  public onSubmit:EventEmitter<any> = new EventEmitter<any>();
}
