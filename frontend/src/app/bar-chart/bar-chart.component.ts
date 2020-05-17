import { Component, ViewEncapsulation, OnInit, Input } from '@angular/core';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import { TaskService } from '../task.service';
import { Task } from '../models/task.model';
import { List } from '../models/list.model';

const STATISTICS = [
];

@Component({
    selector: 'app-bar-chart',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './bar-chart.component.html',
    styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {
    lists: List[];
    tasks: Task[];
    tasksSummary: Array<{ count: number, title: string }>;

    @Input()
    title: string;
    @Input()
    data: Array<any>;

    private width: number;
    private height: number;
    private margin = {top: 20, right: 20, bottom: 30, left: 40};

    private x: any;
    private y: any;
    private svg: any;
    private g: any;

    constructor(private taskService: TaskService) {}

    ngOnInit() {
        this.taskService.getTasksSummary().subscribe((tasks: Array<{ count: number, title: string }>) => {
            console.log('taskssummary', tasks);
            this.tasksSummary = tasks;
        });
        this.initSvg();
        this.initAxis(STATISTICS);
        this.drawAxis();
        this.drawBars(STATISTICS);
    }

    ngOnChanges(changes) {
        if (changes.data) {
            this.initSvg();
            this.initAxis(changes.data.currentValue);
            this.drawAxis();
            this.drawBars(changes.data.currentValue);
        }
    }

    private initSvg() {
        this.svg = d3.select('svg');
        this.width = +this.svg.attr('width') - this.margin.left - this.margin.right;
        this.height = +this.svg.attr('height') - this.margin.top - this.margin.bottom;
        this.g = this.svg.append('g')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
    }

    private initAxis(data: Array<any>) {
        this.x = d3Scale.scaleBand().rangeRound([0, this.width]).padding(0.1);
        this.y = d3Scale.scaleLinear().rangeRound([this.height, 0]);
        this.x.domain(data.map((d) => d.title));
        this.y.domain([0, d3Array.max(data, (d) => d.count)]);
    }

    private drawAxis() {
        this.g.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(d3Axis.axisBottom(this.x));
        this.g.append('g')
            .attr('class', 'axis axis--y')
            .call(d3Axis.axisLeft(this.y).ticks(1))
            .append('text')
            .attr('class', 'axis-title')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '0.71em')
            .attr('text-anchor', 'end')
            .text('Frequency');
    }

    private drawBars(data) {
        this.g.selectAll('.bar')
            .data(data)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', (d) => this.x(d.title) )
            .attr('y', (d) => this.y(d.count) )
            .attr('width', this.x.bandwidth())
            .attr('height', (d) => this.height - this.y(d.count) );
    }

}
