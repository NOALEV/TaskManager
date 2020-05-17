import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  tasksSummary: Array<{ count: number, title: string }>;


  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.taskService.getTasksSummary().subscribe((tasks: Array<{ count: number, title: string }>) => {
      console.log('taskssummary', tasks);
      this.tasksSummary = tasks;
    });
  }

}
