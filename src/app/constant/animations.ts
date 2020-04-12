import { trigger, animate, transition, style, query, group, state } from '@angular/animations';

export const fadeAnimation =
trigger('fadeAnimation', [ 
  transition('void => *', [
    style({ opacity: 0 }), 
    animate(210, style({opacity: 1}))
  ]) 
])

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
