describe('Dashboard Flows', () => {
    beforeEach(() => {
        cy.window().then((win) => {
            win.localStorage.clear();
        });
        cy.setupSupabaseMocks();

        // Log in via bypass
        cy.visit('/auth');
        cy.contains('Dev Auth Bypass').click();
        cy.wait(['@getProfile', '@getProjects']);
    });

    it('should allow editing profile information', () => {
        cy.get('nav').contains('Profile').click();

        // Check initial values (from mocks)
        cy.get('input').filter(':visible').eq(0).should('have.value', 'Dev User');

        // Change values
        cy.get('input').filter(':visible').eq(0).clear().type('Updated Name');
        cy.get('textarea').filter(':visible').clear().type('New Bio');

        cy.contains('Save Changes').click();

        // Verify mock was called
        cy.wait('@updateProfile');
        cy.contains('Profile saved successfully').should('be.visible');
    });

    it('should allow adding a new project', () => {
        cy.get('nav').contains('Work').click();

        // Should show empty state first (mock returns empty list)
        cy.contains('No projects yet').should('be.visible');

        // Add new project
        cy.contains('Add Your First Project').click();

        cy.get('input[placeholder="e.g. E-commerce App"]').type('Test Project');
        cy.get('input[placeholder="e.g. Modern shopping experience"]').type('Test Tagline');

        cy.contains('Add Item').click();

        cy.wait('@addProject');
        cy.contains('Item added successfully').should('be.visible');
    });

    it('should allow switching themes', () => {
        cy.get('nav').contains('Themes').click();

        // Initial state should be Terminal based on mock category? 
        // Wait, mock returns template_id: monolith.

        // Select Terminal
        cy.contains('Terminal').click();
        cy.wait('@updateProfile');

        // Monolith should now be clickable (not active)
        cy.contains('Monolith').parent().should('not.have.class', 'bg-forge-beige');
    });
});
