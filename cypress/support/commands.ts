/// <reference types="cypress" />

declare global {
    namespace Cypress {
        interface Chainable {
            setupSupabaseMocks(): Chainable<void>;
        }
    }
}

Cypress.Commands.add('setupSupabaseMocks', () => {
    // Mock Supabase API calls
    cy.intercept('GET', '**/rest/v1/profiles*', {
        statusCode: 200,
        body: {
            id: '00000000-0000-0000-0000-000000000001',
            username: 'devuser',
            name: 'Dev User',
            bio: 'I am a dev',
            tagline: 'Earth',
            template_id: 'monolith',
            accent_color: '#34d399'
        }
    }).as('getProfile');

    cy.intercept('GET', '**/rest/v1/social_links*', {
        statusCode: 200,
        body: {
            github: '',
            linkedin: '',
            twitter: '',
            website: '',
            email: ''
        }
    }).as('getSocials');

    cy.intercept('GET', '**/rest/v1/experience*', {
        statusCode: 200,
        body: []
    }).as('getExperience');

    cy.intercept('GET', '**/rest/v1/projects*', {
        statusCode: 200,
        body: []
    }).as('getProjects');

    cy.intercept('GET', '**/rest/v1/skills*', {
        statusCode: 200,
        body: []
    }).as('getSkills');

    cy.intercept('GET', '**/rest/v1/education*', {
        statusCode: 200,
        body: []
    }).as('getEducation');

    // Mock POST/PATCH for saves
    cy.intercept('PATCH', '**/rest/v1/profiles*', {
        statusCode: 200,
        body: {}
    }).as('updateProfile');

    cy.intercept('POST', '**/rest/v1/projects*', {
        statusCode: 201,
        body: { id: 'new-project-id' }
    }).as('addProject');
});

export { };
