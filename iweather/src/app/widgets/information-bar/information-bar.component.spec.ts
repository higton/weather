import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InformationBarComponent } from './information-bar.component';

describe('InformationBarComponent', () => {
  let component: InformationBarComponent;
  let fixture: ComponentFixture<InformationBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformationBarComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InformationBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
