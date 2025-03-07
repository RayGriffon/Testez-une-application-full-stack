describe('Details', () => {
    const session = [
        {
            "id": 1,
            "name": "Test",
            "date": "2025-01-01T00:00:00.000+00:00",
            "teacher_id": 1,
            "description": "Test",
            "users": [5],
            "createdAt": "2025-01-01T00:00:00.000000",
            "updatedAt": "2025-01-01T00:00:00.000000"
        }
    ]

    beforeEach(() => {
        cy.intercept('GET', '/api/session', session);
        cy.intercept('GET', '/api/teacher/1', {
            id: 1, firstName: 'Margot', lastName: 'DELAHAYE'
        });

        cy.visit('/login')

        cy.intercept('POST', '/api/auth/login', {
            body: {
                id: 1,
                username: 'test',
                firstName: 'test',
                lastName: 'TEST',
                admin: false
            }
        });

        cy.get('input[formControlName=email]').type("yoga@studio.com")
        cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

        cy.url().should('include', '/sessions')

    })

    it('should display the session details', () => {
        cy.intercept('GET', '/api/session/1', session[0]);
        cy.get('button').contains('Detail').click()
        cy.get('h1').should('contain', 'Test');
        cy.get('.ml1').should('contain', '1 attendees');
        cy.get('.ml1').should('contain', 'January 1, 2025');
        cy.get('.description').should('contain', 'Description: Test');
        cy.get('.created').should('contain', 'Create at:  January 1, 2025');
        cy.get('.updated').should('contain', 'Last update:  January 1, 2025');
    })

    it('should let the user participate a session', () => {
        cy.intercept('POST', '/api/session/1/participate/1', {
            statusCode: 200
        })
        cy.intercept('GET', '/api/session/1', session[0]);
        cy.get('button').contains('Detail').click()
        cy.get('button').contains('Participate').click()
    })

    it('should let the user unparticipate a session', () => {
        const session = [
            {
                "id": 1,
                "name": "Test",
                "date": "2026-01-07T00:00:00.000+00:00",
                "teacher_id": 1,
                "description": "Test",
                "users": [1],
                "createdAt": "2025-01-07T00:00:00.000000",
                "updatedAt": "2025-01-07T00:00:00.000000"
            }
        ]

        cy.intercept('GET', '/api/session', session)

        cy.intercept('POST', '/api/auth/login', {
            body: {
                id: 1,
                username: 'test',
                firstName: 'test',
                lastName: 'TEST',
                admin: false
            }
        });

        cy.visit('/login')
        cy.get('input[formControlName=email]').type("yoga@studio.com")
        cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
        cy.intercept('POST', '/api/session/1/unparticipate/1', {
            statusCode: 200
        })
        cy.intercept('GET', '/api/session/1', session[0]);
        cy.get('button').contains('Detail').click()
        cy.get('button').contains('Do not participate').click()
    })
})