import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'role-selector',
  templateUrl: './role-selector.component.html',
  styleUrls: ['./role-selector.component.scss']
})
export class RoleSelectorComponent implements OnInit {

  @Output() selectedRole: EventEmitter<string> = new EventEmitter();
  private _role;

  set role(new_role) {
    this._role = new_role;
    this.selectedRole.emit(new_role.toUpperCase());
  }

  get role() {
    return this._role;
  }

  constructor() { }

  ngOnInit() {
  }

}
