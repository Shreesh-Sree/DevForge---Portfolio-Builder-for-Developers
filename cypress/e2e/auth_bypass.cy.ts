describe('Dev Auth Bypass', () => {
    beforeEach(() => {
        // Clear localStorage to ensure a clean state
        cy.window().then((win) => {
            win.localStorage.clear();
        });

        // Use shared Supabase mocks
        cy.setupSupabaseMocks();
    });

    it('should show the Dev Auth Bypass button and redirect to dashboard', () => {
        cy.visit('/auth');

        // Check if the bypass button exists
        cy.contains('Dev Auth Bypass').should('be.visible').click();

        // Should redirect to dashboard
        cy.url().should('include', '/dashboard');

        // Wait for data load
        cy.wait(['@getProfile', '@getProjects']);

        // Verify we are on the dashboard
        cy.contains('Your Sites', { matchCase: false }).should('be.visible');

        // Verify bypass flag is set in localStorage
        cy.window().then((win) => {
            expect(win.localStorage.getItem('dev_auth_bypass')).to.equal('true');
        });
    });

    it('should allow navigation between dashboard tabs when bypassed', () => {
        // Enable bypass first
        cy.visit('/auth');
        cy.contains('Dev Auth Bypass').click();
        cy.wait(['@getProfile', '@getProjects']);

        // Navigate to Profile
        cy.get('nav').contains('Profile').click();
        cy.contains('Legal Name').should('be.visible');

        // Navigate to Work
        cy.get('nav').contains('Work').click();
        cy.contains('No projects yet').should('be.visible');
    });

    it('should work on mobile view using the dropdown', () => {
        cy.viewport('iphone-xr');
        cy.visit('/auth');
        cy.contains('Dev Auth Bypass').click();
        cy.wait(['@getProfile', '@getProjects']);

        // Open mobile nav trigger
        cy.get('button').contains('Portfolios').should('be.visible').click();

        // Verify dropdown menu is visible and contains options
        cy.get('button').contains('Profile').should('be.visible').click();

        // Verify it switched
        cy.contains('Legal Name').should('be.visible');
        // Verify the trigger now shows Profile
        cy.get('button').contains('Profile').should('be.visible');
    });
});
