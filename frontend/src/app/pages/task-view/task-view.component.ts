import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/task.service';
import { TmplAstElement } from '@angular/compiler';
import { ActivatedRoute, Params } from '@angular/router';
import { List } from 'src/app/models/list.model';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {
lists:List[];
tasks:Task[];
  constructor(private taskService: TaskService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
    
        this.taskService.getTasks(params.listId).subscribe((tasks: any[]) => {
          this.tasks=tasks;
        })
  }
    )
    this.taskService.getList().subscribe((lists:any[])=>{
    this.lists=lists;
    }
    )
}

onTaskClick(task: Task) {
  // we want to set the task to completed
  this.taskService.complete(task).subscribe(() => {
    // the task has been set to completed successfully
    console.log("Completed successully!");
    task.completed = !task.completed;
  })
}

}


