import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IndicadorConexion } from './indicador-conexion';

describe('IndicadorConexion', () => {
  let component: IndicadorConexion;
  let fixture: ComponentFixture<IndicadorConexion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndicadorConexion],
    }).compileComponents();

    fixture = TestBed.createComponent(IndicadorConexion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
