describe('Edit', () => {
    let sessions = [
        {
            "id": 1,
            "name": "Test",
            "date": "2025-01-01T00:00:00.000000",
            "teacher_id": 1,
            "description": "Test",
            "users": [],
            "createdAt": "2025-01-01T00:00:00.00",
            "updatedAt": "2025-01-01T00:00:00.00"
        },
        {
            "id": 2,
            "name": "Second test",
            "date": "2025-02-01T00:00:00.000000",
            "teacher_id": 2,
            "description": "Description second test",
            "users": [],
            "createdAt": "2025-01-01T00:00:00.00",
            "updatedAt": "2025-01-01T00:00:00.00"
        }
    ]
    beforeEach(() => {
        cy.intercept('GET', '/api/teacher', {
            body: [
                { id: 1, firstName: 'Margot', lastName: 'DELAHAYE' },
                { id: 2, firstName: 'Hélène', lastName: 'THIERCELIN' }
            ]
        });

        cy.intercept('GET', '/api/teacher/1', {
            id: 1, firstName: 'Margot', lastName: 'DELAHAYE'
        });
        cy.intercept('GET', '/api/teacher/2', {
            id: 2, firstName: 'Hélène', lastName: 'THIERCELIN'
        });
        cy.intercept('GET', '/api/session', sessions);

        cy.intercept('POST', '/api/auth/login', {
            body: {
                id: 1,
                username: 'John',
                firstName: 'John',
                lastName: 'Doe',
                admin: true
            }
        });

        cy.visit('/login')
        cy.get('input[formControlName=email]').type("yoga@studio.com")
        cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    })
    it('should create button then display creation form', () => {
        sessions.push({
            "id": 3,
            "name": "Nouvelle session",
            "date": "2025-03-02T00:00:00.000+00:00",
            "teacher_id": 1,
            "description": "Description nouvelle session",
            "users": [],
            "createdAt": "2025-01-01T00:00:00.00",
            "updatedAt": "2025-01-01T00:00:00.00"
        });
        cy.contains('button', 'Create').click();
        cy.get('form').should('be.visible');

        cy.url().should('include', '/sessions/create') 

        cy.intercept('POST', '/api/session', { 
            body: {
                id: 3,
                name: "Nouvelle session",
                date: "2025-03-02T00:00:00.000+00:00",
                teacher_id: 1,
                description: "Description nouvelle session",
                users: [],
                createdAt: "2025-01-01T00:00:00.00",
                updatedAt: "2025-01-01T00:00:00.00"
            },
        });

        cy.get('input[formControlName=name]').type("Nouvelle session")
        cy.get('input[formControlName=date]').type(`2025-03-02`)
        cy.get('mat-select[formControlName=teacher_id]').click()
        cy.get('mat-option').contains('Margot DELAHAYE').click();
        cy.get('textarea[formControlName=description]').type("Description nouvelle session")

        cy.intercept('GET', '/api/session', sessions); 
        cy.contains('button', 'Save').click(); 

        cy.url().should('include', '/sessions')
        cy.get('.mat-snack-bar-container').should('contain', 'Session created !'); 
    })

    it('should let the admin delete a session', () => {
        cy.intercept('DELETE', '/api/session/1', {
            statusCode: 200
        })
        cy.intercept('GET', '/api/session', {
            body: [{
                "id": 2,
                "name": "Second test",
                "date": "2025-02-01T00:00:00.000000",
                "teacher_id": 2,
                "description": "Description second test",
                "users": [],
                "createdAt": "2025-01-01T00:00:00.00",
                "updatedAt": "2025-01-01T00:00:00.00"
            }, {
                "id": 3,
                "name": "Nouvelle session",
                "date": "2025-03-02T00:00:00.000+00:00",
                "teacher_id": 1,
                "description": "Description nouvelle session",
                "users": [],
                "createdAt": "2025-01-01T00:00:00.00",
                "updatedAt": "2025-01-01T00:00:00.00"
            }]
        })
        cy.intercept('GET', '/api/session/1', sessions[0]);
        cy.get('button').contains('Detail').click()
        cy.get('button').contains('Delete').click()

        cy.get('.mat-snack-bar-container').should('contain', 'Session deleted !');

        cy.url().should('include', '/session');
    })
    it('should let the admin update a session', () => {
        const sessionUpdated = {
            id: 1,
            name: "Test",
            date: "2025-01-01T00:00:00.000000",
            teacher_id: 1,
            description: "Test",
            users: [],
            createdAt: "2025-01-01T00:00:00.00",
            updatedAt: "2025-01-01T00:00:00.00"
        }

        cy.intercept('GET', '/api/session', {
            body: [sessionUpdated,
                {
                    "id": 2,
                    "name": "Second test",
                    "date": "2025-02-01T00:00:00.000000",
                    "teacher_id": 2,
                    "description": "Description second test",
                    "users": [],
                    "createdAt": "2025-01-01T00:00:00.00",
                    "updatedAt": "2025-01-01T00:00:00.00"
                }, {
                    "id": 3,
                    "name": "Nouvelle session",
                    "date": "2025-03-02T00:00:00.000+00:00",
                    "teacher_id": 1,
                    "description": "Description nouvelle session",
                    "users": [],
                    "createdAt": "2025-01-01T00:00:00.00",
                    "updatedAt": "2025-01-01T00:00:00.00"
                }]
        });
        cy.intercept('PUT', '/api/session/1', {
            statusCode: 200,
            body: [sessionUpdated]
        })

        cy.intercept('GET', '/api/session/1', sessions[0]);

        cy.get('button').contains('Edit').click()

        cy.get('input[formControlName=name]').type(" - session mise à jour")
        cy.get('input[formControlName=date]').type(`2025-03-02`)
        cy.get('mat-select[formControlName=teacher_id]').click()
        cy.get('mat-option').contains('Margot DELAHAYE').click();
        cy.get('textarea[formControlName=description]').type(" - description mise à jour")
        cy.get('button').contains('Save').click()




    })
})