import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SessionApiService } from './session-api.service';
import { Session } from '../interfaces/session.interface';

describe('SessionApiService', () => {
  let service: SessionApiService;
  let httpMock: HttpTestingController;
  const apiUrl = 'api/session';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SessionApiService]
    });

    service = TestBed.inject(SessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all sessions', () => {
    const mockSessions: Session[] = [
      { id: 1, name: 'Session 1', description: 'Desc 1', date: new Date('2024-02-08'), teacher_id: 101, users: [] },
      { id: 2, name: 'Session 2', description: 'Desc 2', date: new Date('2024-02-09'), teacher_id: 102, users: [] }
    ];

    service.all().subscribe(sessions => {
      expect(sessions.length).toBe(2);
      expect(sessions).toEqual(mockSessions);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockSessions);
  });

  it('should retrieve session details', () => {
    const mockSession: Session = { id: 1, name: 'Session 1', description: 'Desc 1', date: new Date('2024-02-08'), teacher_id: 101, users: [] };

    service.detail('1').subscribe(session => {
      expect(session).toEqual(mockSession);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSession);
  });

  it('should delete a session', () => {
    service.delete('1').subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should create a session', () => {
    const newSession: Session = { id: 3, name: 'Session 3', description: 'Desc 3', date: new Date('2024-02-10'), teacher_id: 103, users: [] };

    service.create(newSession).subscribe(session => {
      expect(session).toEqual(newSession);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newSession);
    req.flush(newSession);
  });

  it('should update a session', () => {
    const updatedSession: Session = { id: 1, name: 'Updated Session', description: 'Updated Desc', date: new Date('2024-02-11'), teacher_id: 101, users: [] };
    service.update('1', updatedSession).subscribe(session => {
      expect(session).toEqual(updatedSession);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedSession);
    req.flush(updatedSession);
  });

  it('should participate in a session', () => {
    service.participate('1', 'user123').subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${apiUrl}/1/participate/user123`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBeNull();
    req.flush(null);
  });

  it('should unparticipate from a session', () => {
    service.unParticipate('1', 'user123').subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${apiUrl}/1/participate/user123`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
