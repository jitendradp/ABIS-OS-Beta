import {Component, Input} from '@angular/core';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material";

export interface Chip {
  name: string;
}

@Component({
  selector: 'app-list-chip',
  templateUrl: './list-chip.component.html',
  styleUrls: ['./list-chip.component.css']
})
export class ListChipComponent {

  @Input()
  placeholder: string = "Add chips...";
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  chips: Chip[] = [];

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our member
    if ((value || '').trim()) {
      this.chips.push({name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(chip: Chip): void {
    const index = this.chips.indexOf(chip);

    if (index >= 0) {
      this.chips.splice(index, 1);
    }
  }
}
