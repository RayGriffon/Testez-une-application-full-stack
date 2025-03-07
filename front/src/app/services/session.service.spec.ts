import { TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with isLogged as false', () => {
    expect(service.isLogged).toBe(false);
  });

  it('should update isLogged and sessionInformation on logIn', () => {
    const user: SessionInformation = { 
      username: 'testUser', 
      token: '123456',
      type: 'user',
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      admin: false
    };
    service.logIn(user);
    expect(service.isLogged).toBe(true);
    expect(service.sessionInformation).toEqual(user);
  });

  it('should update isLogged and clear sessionInformation on logOut', () => {
    const user: SessionInformation = { 
      username: 'testUser', 
      token: '123456',
      type: 'user',
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      admin: false
    };
    service.logIn(user);
    service.logOut();
    expect(service.isLogged).toBe(false);
    expect(service.sessionInformation).toBeUndefined();
  });

  it('should emit correct values from $isLogged()', (done) => {
    const user: SessionInformation = { 
      username: 'testUser', 
      token: '123456',
      type: 'user',
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      admin: false
    };
    const expectedValues = [false, true, false];
    let index = 0;

    service.$isLogged().subscribe((value) => {
      expect(value).toBe(expectedValues[index]);
      index++;
      if (index === expectedValues.length) {
        done();
      }
    });

    service.logIn(user);
    service.logOut();
  });
});
