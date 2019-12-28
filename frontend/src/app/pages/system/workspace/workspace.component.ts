import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent {

  @Input()
  description: string = "Create a workspace to manage data and accesses. If you choose the public mode other participants can find and enter your workspace. The private workspace protects your data from unauthorized access.";

}
