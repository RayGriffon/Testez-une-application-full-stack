import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { DetailComponent } from './detail.component';
import { SessionService } from '../../../../services/session.service';
import { TeacherService } from '../../../../services/teacher.service';
import { SessionApiService } from '../../services/session-api.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let mockSessionService: any;
  let mockSessionApiService: any;
  let mockTeacherService: any;
  let mockMatSnackBar: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockSessionService = {
      sessionInformation: { admin: true, id: 1 }
    };

    mockSessionApiService = {
      detail: jest.fn().mockReturnValue(of({ id: '1', teacher_id: '2', users: [1, 2, 3] })),
      delete: jest.fn().mockReturnValue(of({})),
      participate: jest.fn().mockReturnValue(of({})),
      unParticipate: jest.fn().mockReturnValue(of({})),
    };

    mockTeacherService = {
      detail: jest.fn().mockReturnValue(of({ id: '2', name: 'Teacher Name' }))
    };

    mockMatSnackBar = { open: jest.fn() };
    mockRouter = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, MatSnackBarModule, ReactiveFormsModule, MatIconModule, MatCardModule],
      declarations: [DetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        { provide: Router, useValue: mockRouter },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch session on init', () => {
    expect(mockSessionApiService.detail).toHaveBeenCalledWith('1');
    expect(component.session).toEqual({ id: '1', teacher_id: '2', users: [1, 2, 3] });
  });

  it('should delete session and navigate', () => {
    component.delete();
    expect(mockSessionApiService.delete).toHaveBeenCalledWith('1');
    expect(mockMatSnackBar.open).toHaveBeenCalledWith('Session deleted !', 'Close', { duration: 3000 });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
  });

  it('should participate in session', () => {
    component.participate();
    expect(mockSessionApiService.participate).toHaveBeenCalledWith('1', '1');
  });

  it('should unParticipate from session', () => {
    component.unParticipate();
    expect(mockSessionApiService.unParticipate).toHaveBeenCalledWith('1', '1');
  });

  it('should fetch teacher details', () => {
    expect(mockTeacherService.detail).toHaveBeenCalledWith('2');
    expect(component.teacher).toEqual({ id: '2', name: 'Teacher Name' });
  });
});
