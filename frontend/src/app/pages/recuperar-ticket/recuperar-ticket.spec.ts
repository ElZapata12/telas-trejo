import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecuperarTicket } from './recuperar-ticket';

describe('RecuperarTicket', () => {
  let component: RecuperarTicket;
  let fixture: ComponentFixture<RecuperarTicket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecuperarTicket],
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarTicket);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
