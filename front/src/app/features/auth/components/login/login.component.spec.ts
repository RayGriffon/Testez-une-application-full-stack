import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { SessionService } from 'src/app/services/session.service';
import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: any;
  let sessionServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = {
      login: jest.fn()
    };

    sessionServiceMock = {
      logIn: jest.fn()
    };

    routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('should validate email field', () => {
    const email = component.form.controls['email'];
    email.setValue('invalid-email');
    expect(email.valid).toBeFalsy();
    email.setValue('valid@example.com');
    expect(email.valid).toBeTruthy();
  });

  //Changer Validators.min(3) en Validators.minLength(3) dans le password de login.component.ts -> Seemble plus approprié
  it('should validate password field', () => {
   const password = component.form.controls['password'];
   password.setValue('12'); // Trop court
   expect(password.valid).toBeFalsy();
   password.setValue('123'); // Valide
   expect(password.valid).toBeTruthy();
  });

  // it('should validate password field', () => {
  //   const password = component.form.controls['password'];
  
  //   password.setValue('4'); 
  //   expect(password.valid).toBeTruthy();  
  
  //   password.setValue('a');
  //   expect(password.valid).toBeTruthy(); 
  // });
  

  it('should call AuthService login on submit and navigate on success', () => {
    component.form.setValue({ email: 'test@example.com', password: '123456' });
    authServiceMock.login.mockReturnValue(of({ token: 'dummy-token' }));

    component.submit();
    
    expect(authServiceMock.login).toHaveBeenCalledWith({ email: 'test@example.com', password: '123456' });
    expect(sessionServiceMock.logIn).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  it('should set onError to true if login fails', () => {
    component.form.setValue({ email: 'test@example.com', password: '123456' });
    authServiceMock.login.mockReturnValue(throwError(() => new Error('Login failed')));
    
    component.submit();
    
    expect(component.onError).toBeTruthy();
  });
});
