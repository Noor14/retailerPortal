import { trigger, animate, transition, style, query, group, state } from '@angular/animations';

export const fadeAnimation =
    trigger('fadeAnimation', [
      transition('* => *', [
        query(':enter', [
                style({ opacity: 0 })
            ], { optional: true }
        ),
        group([
            query(':leave', [
                    animate(20, style({ opacity: 0 }))
                ],
                { optional: true }
            ),
            query(':enter', [
                    style({ opacity: 0 }),
                    animate(300, style({ opacity: 1 }))
                ],
                { optional: true }
            )
        ])
    ])]);

export const slideInOut =
trigger('slideInOut', [
  transition(':enter', [
    style({transform: 'translateX(-100%)'}),
    animate('200ms ease-in', style({
      transform: 'translateX(0%)',
    }))
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({
      transform: 'translateX(-100%)',
    }))
  ])
]);
