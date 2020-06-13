import { RoleAuthorizationService } from './../services/role-authorization.service';
import { Directive, OnInit, TemplateRef, ViewContainerRef, Input } from '@angular/core';

@Directive({
  selector: '[userRole]'
})

export class UserRoleDirective implements OnInit {
    constructor(
        private templateRef: TemplateRef<any>,
        private _roleAuthorizationService: RoleAuthorizationService,
        private viewContainer: ViewContainerRef
    ) { }

    private userRoles: any;

    @Input() 
    set userRole(roles) {
        if (!roles || !roles.length) {
            throw new Error('Roles value is empty or missed');
        }

        this.userRoles = roles;
    }

    ngOnInit() {
        let hasAccess = false;
        if (this._roleAuthorizationService.isAuthorized() && this.userRoles && this.userRoles.length) {
            hasAccess = this.userRoles.some(r => this._roleAuthorizationService.hasRole(r));
        }

        if (hasAccess) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }
}
