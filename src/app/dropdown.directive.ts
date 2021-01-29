import { Directive, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[cmsDropdown]'
})

export class DropdownDirective{
  @HostBinding('class.open') isOpen = false;

  @HostListener('click') toggleOpen(){ //I want to execute toggleOpen when the click event happens
  this.isOpen = !this.isOpen;

  }
}
