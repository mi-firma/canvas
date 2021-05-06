import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IPlan } from 'src/app/interfaces';

@Component({
  selector: 'app-plan-slider',
  templateUrl: './plan-slider.component.html',
  styleUrls: ['./plan-slider.component.css']
})
export class PlanSliderComponent implements OnInit {

  @Input() plans: IPlan[];

  @Input() config: any;

  @Output() planSelected = new EventEmitter<IPlan>();

  @Output() slideChanged = new EventEmitter<number>();

  constructor(
  ) { }

  ngOnInit(): void {
  }

  afterChange(event: any): void {
    const slide = event.currentSlide;
    this.slideChanged.emit(slide);
  }

  planSubsChanged(plan: IPlan): void {
    plan.subscriptionsSelected = (plan.subscriptionsSelected + 1) % 2;
  }

  planSelectedInternal(plan: IPlan): void {
    this.planSelected.emit(plan);
  }
}
