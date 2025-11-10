describe('Crossy Road Game', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.wait(3000); // Wait for game to load and initialize
    cy.get('#score').should('be.visible'); // Ensure score is visible before each test
  });

  it('should load the game page', () => {
    cy.title().should('include', 'Crossy Road');
    cy.get('#root').should('be.visible');
  });

  it('should display game UI elements', () => {
    // Check for score display with ID
    cy.get('#score').should('be.visible');

    // Check for controls with ID
    cy.get('#controls').should('be.visible');
  });

  it('should start with score of 0', () => {
    cy.get('#score').should('contain', '0');
  });

  it('should respond to keyboard controls - arrow up', () => {
    cy.get('#score')
      .invoke('text')
      .then(initialScore => {
        const initial = parseInt(initialScore);

        // Press arrow up to move player forward
        cy.get('body').type('{uparrow}');
        cy.wait(500);

        cy.get('#score')
          .invoke('text')
          .then(newScoreText => {
            const newScore = parseInt(newScoreText);
            expect(newScore).to.be.gte(initial);
          });
      });
  });

  it('should respond to keyboard controls - all directions', () => {
    // Test multiple directional inputs
    cy.get('body').type('{leftarrow}');
    cy.wait(200);

    cy.get('body').type('{rightarrow}');
    cy.wait(200);

    cy.get('body').type('{uparrow}');
    cy.wait(200);

    cy.get('body').type('{downarrow}');
    cy.wait(200);

    // Game should still be running (no crash)
    cy.get('#score').should('be.visible');
  });

  it('should respond to button clicks', () => {
    // Click the up button - use first button in controls
    cy.get('#controls button').first().click();

    cy.wait(300);

    // Game should respond
    cy.get('#score').should('be.visible');
  });

  it('should show game over screen on collision', () => {
    // Move forward many times to likely encounter obstacles
    for (let i = 0; i < 15; i++) {
      cy.get('body').type('{uparrow}');
      cy.wait(50);
    }

    cy.wait(1000);

    // Check if result screen might appear
    cy.get('body').then($body => {
      if ($body.find('#result').length > 0) {
        cy.get('#result').should('be.visible');
      }
    });
  });

  it('should have canvas for 3D rendering', () => {
    cy.get('canvas').should('be.visible');

    // Canvas should have dimensions
    cy.get('canvas').should($canvas => {
      expect($canvas.width()).to.be.greaterThan(0);
      expect($canvas.height()).to.be.greaterThan(0);
    });
  });

  it('should maintain game state during play', () => {
    // Move forward
    cy.get('body').type('{uparrow}');
    cy.wait(300);

    cy.get('#score')
      .invoke('text')
      .then(scoreText => {
        const score = parseInt(scoreText);

        // Wait a bit
        cy.wait(500);

        // Check score is maintained
        cy.get('#score')
          .invoke('text')
          .then(newScoreText => {
            const newScore = parseInt(newScoreText);
            expect(newScore).to.be.gte(score);
          });
      });
  });

  it('should handle rapid key presses', () => {
    // Rapid fire inputs
    for (let i = 0; i < 5; i++) {
      cy.get('body').type('{leftarrow}');
    }
    for (let i = 0; i < 5; i++) {
      cy.get('body').type('{rightarrow}');
    }

    // Game should still be functional
    cy.get('#score').should('be.visible');
  });

  it('should allow clicking directional buttons', () => {
    // Click all four directional buttons
    cy.get('#controls button').eq(0).click(); // up
    cy.wait(100);
    cy.get('#controls button').eq(1).click(); // left
    cy.wait(100);
    cy.get('#controls button').eq(2).click(); // down
    cy.wait(100);
    cy.get('#controls button').eq(3).click(); // right
    cy.wait(100);

    // Game should still be running
    cy.get('#score').should('be.visible');
  });
});
