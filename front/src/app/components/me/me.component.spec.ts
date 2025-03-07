import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeComponent } from './me.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let userServiceMock: any;
  let sessionServiceMock: any;
  let snackBarMock: any;
  let routerMock: any;

  beforeEach(async () => {
    userServiceMock = {
      getById: jest.fn().mockReturnValue(of({ id: 1, name: 'Test User' })),
      delete: jest.fn().mockReturnValue(of({}))
    };

    sessionServiceMock = {
      sessionInformation: { id: 1, admin: true },
      logOut: jest.fn()
    };

    snackBarMock = {
      open: jest.fn()
    };

    routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user on init', () => {
    expect(userServiceMock.getById).toHaveBeenCalledWith('1');
    expect(component.user).toEqual({ id: 1, name: 'Test User' });
  });

  it('should call window.history.back on back()', () => {
    jest.spyOn(window.history, 'back');
    component.back();
    expect(window.history.back).toHaveBeenCalled();
  });

  it('should delete user and navigate to home', () => {
    component.delete();
    expect(userServiceMock.delete).toHaveBeenCalledWith('1');
    expect(snackBarMock.open).toHaveBeenCalledWith("Your account has been deleted !", 'Close', { duration: 3000 });
    expect(sessionServiceMock.logOut).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });
});
