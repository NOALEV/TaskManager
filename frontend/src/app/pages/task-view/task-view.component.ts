import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/task.service';
import { TmplAstElement } from '@angular/compiler';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {

  constructor(private taskService: TaskService) { }

  ngOnInit() {
  }

createNewList(){
//we want to send a web request to create a list
this.taskService.createList('Testing').subscribe((response: any) => {
console.log(Response);
});

  }
}

