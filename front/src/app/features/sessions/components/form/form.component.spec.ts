import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormComponent } from './form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DebugElement } from '@angular/core';
import { Session } from '../../interfaces/session.interface';
import { By } from '@angular/platform-browser';

describe('FormComponent integration test suite', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  }
  
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let sessionApiService: SessionApiService;
  let httpTestingController: HttpTestingController;
  let matSnackBar: MatSnackBar;
  let name: DebugElement;
  let date: DebugElement;
  let teacher: DebugElement;
  let description: DebugElement;
  let sessionForm: DebugElement;

  const session: Session = {
    id: 1,
    name: 'test mock',
    description: 'description test',
    date: new Date('2025-01-01'),
    teacher_id: 1,
    users: [1],
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({

      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        SessionApiService
      ],
      declarations: [FormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    sessionApiService = TestBed.inject(SessionApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
    matSnackBar = TestBed.inject(MatSnackBar)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Create session', () => {

    beforeEach(() => {
      //@ts-ignore
      router.currentUrlTree = router.parseUrl('/sessions/create'); 
      name = fixture.debugElement.query(By.css('input[formControlName="name"]'));
      date = fixture.debugElement.query(By.css('input[formControlName="date"]'));
      teacher = fixture.debugElement.query(By.css('mat-select[formControlName="teacher_id"]'));
      description = fixture.debugElement.query(By.css('textarea[formControlName="description"]'));
      sessionForm = fixture.debugElement.query(By.css('.mt2'));
    });

    it('should show the creation form', () => {
      expect(component.onUpdate).toBeFalsy();

      expect(component.sessionForm?.controls['name'].value).toBeFalsy();
      expect(component.sessionForm?.controls['date'].value).toBeFalsy();
      expect(component.sessionForm?.controls['teacher_id'].value).toBeFalsy();
      expect(component.sessionForm?.controls['description'].value).toBeFalsy();
    });

    it('should create a yoga session and redirect the user on the sessions list', async () => {
      jest.spyOn(matSnackBar, 'open').mockImplementation();
      jest.spyOn(router, 'navigate').mockImplementation();
      name.nativeElement.value = session.name;
      date.nativeElement.value = session.date;
      teacher.nativeElement.value = session.teacher_id;
      description.nativeElement.value = session.description;

      name.nativeElement.dispatchEvent(new Event('input'));
      date.nativeElement.dispatchEvent(new Event('input'));
      teacher.nativeElement.dispatchEvent(new Event('input'));
      description.nativeElement.dispatchEvent(new Event('input'));

      sessionForm.triggerEventHandler('ngSubmit', null);
      await fixture.whenStable();
      fixture.detectChanges();

      const req = httpTestingController.expectOne('api/session');

      req.flush(session);
      expect(req.request.method).toBe('POST');

      expect(matSnackBar.open).toHaveBeenCalledWith('Session created !', "Close", { "duration": 3000 });
      expect(router.navigate).toBeCalledWith(['sessions']);
    });
  });

  describe('Update session', () => {

    beforeEach(async () => { // "@ts-ignore" permet d'ignorer l'erreur "Property 'currentUrlTree' "
      //@ts-ignore
      router.currentUrlTree = router.parseUrl('/sessions/update/1');

      jest.spyOn(activatedRoute.snapshot.paramMap, 'get').mockReturnValue('1'); 
      fixture = TestBed.createComponent(FormComponent); 
      component = fixture.componentInstance; 
      fixture.detectChanges(); 
    });

    it('should show the update form', () => {
      const req = httpTestingController.expectOne('api/session/1');

      req.flush(session);

      expect(component.onUpdate).toBeTruthy();
      expect(component.sessionForm?.controls['name'].value).toBe('test mock');
      expect(component.sessionForm?.controls['date'].value).toBe('2025-01-01');
      expect(component.sessionForm?.controls['teacher_id'].value).toBe(1);
      expect(component.sessionForm?.controls['description'].value).toBe('description test');
    });

    it('should update the session', async () => {
      const request = httpTestingController.expectOne('api/session/1');

      request.flush(session);

      await fixture.whenStable();

      fixture.detectChanges();

      expect(component.sessionForm).toBeTruthy();

      name = fixture.debugElement.query(By.css('input[formControlName="name"]'));
      date = fixture.debugElement.query(By.css('input[formControlName="date"]'));
      teacher = fixture.debugElement.query(By.css('mat-select[formControlName="teacher_id"]'));
      description = fixture.debugElement.query(By.css('textarea[formControlName="description"]'));
      sessionForm = fixture.debugElement.query(By.css('.mt2'));

      jest.spyOn(matSnackBar, 'open').mockImplementation();
      jest.spyOn(router, 'navigate').mockImplementation();

      name.nativeElement.value = session.name;
      date.nativeElement.value = session.date;
      teacher.nativeElement.value = session.teacher_id;
      description.nativeElement.value = session.description;

      name.nativeElement.dispatchEvent(new Event('input'));
      date.nativeElement.dispatchEvent(new Event('input'));
      teacher.nativeElement.dispatchEvent(new Event('input'));
      description.nativeElement.dispatchEvent(new Event('input'));

      sessionForm.triggerEventHandler('ngSubmit', null);

      await fixture.whenStable();

      fixture.detectChanges();

      const req = httpTestingController.expectOne('api/session/1');

      req.flush(session);

      expect(req.request.method).toBe('PUT');
      expect(matSnackBar.open).toHaveBeenCalledWith('Session updated !', "Close", { "duration": 3000 });
      expect(router.navigate).toBeCalledWith(['sessions']);
    });
  });
});