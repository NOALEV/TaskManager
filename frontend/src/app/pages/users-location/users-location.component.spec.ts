import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersLocationComponent } from './users-location.component';

describe('UsersLocationComponent', () => {
  let component: UsersLocationComponent;
  let fixture: ComponentFixture<UsersLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
