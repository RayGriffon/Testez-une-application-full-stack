import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MatToolbarModule } from '@angular/material/toolbar';
import { AppComponent } from './app.component';
import { AuthService } from './features/auth/services/auth.service';
import { SessionService } from './services/session.service';

describe('AppComponent', () => {
  let mockAuthService: Partial<AuthService>;
  let mockSessionService: Partial<SessionService>;
  let mockRouter: Partial<Router>;

  beforeEach(async () => {
    mockAuthService = {};

    mockSessionService = {
      $isLogged: jest.fn().mockReturnValue(of(true)),
      logOut: jest.fn(),
    };

    mockRouter = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatToolbarModule],
      declarations: [AppComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should call sessionService.$isLogged() when $isLogged() is called', (done) => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.$isLogged().subscribe((isLogged) => {
      expect(isLogged).toBe(true);
      expect(mockSessionService.$isLogged).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('should call sessionService.logOut() and navigate to root when logout() is called', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.logout();

    expect(mockSessionService.logOut).toHaveBeenCalledTimes(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });
});
