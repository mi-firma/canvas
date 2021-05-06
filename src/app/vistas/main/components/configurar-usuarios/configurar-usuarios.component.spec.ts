import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurarUsuariosComponent } from './configurar-usuarios.component';

describe('ConfigurarUsuariosComponent', () => {
    let component: ConfigurarUsuariosComponent;
    let fixture: ComponentFixture<ConfigurarUsuariosComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ConfigurarUsuariosComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfigurarUsuariosComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
