import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IPlan } from 'src/app/interfaces';
import { CartService } from 'src/app/servicios/catalog/cart.service';
import { PlansService } from 'src/app/servicios/catalog/plans.service';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit, OnDestroy {

  maxDiscount: number;

  isB2B: boolean;

  plansB2B: IPlan[] = [];
  plansB2C: IPlan[] = [];
  plans: IPlan[] = [];

  planIndex = 0;
  plansPerPage = 3;

  plansB2BSubscription: Subscription;
  plansB2CSubscription: Subscription;

  slideConfig = {
    infinite: false,
    slidesToShow: 3,
    responsive: [
      {
        breakpoint: 1180,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  constructor(
    private router: Router,
    private planService: PlansService,
    private cartService: CartService
  ) { }

  /**
   * Retrieves the plans
   */
  ngOnInit(): void {
    this.plansB2CSubscription = this.planService.getPlans('B2C')
      .subscribe((plans: IPlan[]) => {
        this.plansB2C = plans;
        this.plans = plans;

        this.plansB2C.forEach((plan: IPlan) => {
          plan.subscriptionsSelected = 0;
        });

        this.maxDiscount = 0;

        for (const plan of this.plansB2C) {
          for (const subs of plan.subscriptionsDto) {
            if (subs.price <= 0 || subs.discount <= 0) continue;
            this.maxDiscount = Math.max(this.maxDiscount, Math.round(100 - (subs.discount * 100 / subs.price)));
          }
        }
    });

    this.plansB2BSubscription = this.planService.getPlans('B2B')
      .subscribe((plans: IPlan []) => {
        this.plansB2B = plans;

        this.plansB2B.forEach((plan: IPlan) => {
          plan.subscriptionsSelected = 0;
        });
    });

    if (window.innerWidth < 1180) {
      this.plansPerPage = 2;
    }

    if (window.innerWidth < 640) {
      this.plansPerPage = 1;
    }
  }

  planCategoryChanged(): void {
    this.plans = this.isB2B ? this.plansB2B : this.plansB2C;
  }

  /**
   * Event that triggers when a plan is chosen
   */
  purchase(plan: IPlan): void {
    const intervalCode = plan.subscriptionsDto.length > 0 ?  plan.subscriptionsDto[plan.subscriptionsSelected].intervalCode: '';
    this.cartService.addItem(plan, intervalCode);
    this.router.navigateByUrl('main/pagos');
  }

  updatePlanIndex(index: number): void {
    this.planIndex = index;
  }

  ngOnDestroy(): void {
    if (this.plansB2BSubscription) {
      this.plansB2BSubscription.unsubscribe();
    }
    if (this.plansB2CSubscription) {
      this.plansB2CSubscription.unsubscribe();
    }
  }
}
