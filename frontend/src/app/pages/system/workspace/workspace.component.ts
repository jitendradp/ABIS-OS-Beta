import {Component, Input} from '@angular/core';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material";


export interface Tag {
  name: string;
}


@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent {

  @Input()
  description: string = "Create a workspace to manage data and accesses. If you choose the public mode other participants can find and enter your workspace. The private workspace protects your data from unauthorized access.";

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: Tag [] = [];

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Adds a tag
    if ((value || '').trim()) {
      this.tags.push({name: value.trim()});
    }

    // Resets the input value
    if (input) {
      input.value = '';
    }
  }

  remove(tag: Tag): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

}
