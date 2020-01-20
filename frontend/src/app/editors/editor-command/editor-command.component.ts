import {Component} from '@angular/core';
import {coerceNumberProperty} from "@angular/cdk/coercion";

@Component({
  selector: 'app-editor-command',
  templateUrl: './editor-command.component.html',
  styleUrls: ['./editor-command.component.css']
})
export class EditorCommandComponent {

  autoTicks = false;
  disabled = false;
  invert = false;
  max = 100;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = false;
  value = 0;
  vertical = false;

  get tickInterval(): number | 'auto' {
    return this.showTicks ? (this.autoTicks ? 'auto' : this._tickInterval) : 0;
  }

  set tickInterval(value) {
    this._tickInterval = coerceNumberProperty(value);
  }

  private _tickInterval = 1;
}
