/**
 * @file Brewery Table E2E Test Suite
 * 
 * This file contains end-to-end tests for the Brewery Table page.
 * The tests cover rendering, filtering, clearing filters, and pagination
 * to ensure the functionality and reliability of the Brewery Table flow.
 */

describe("Brewery Table Flow", () => {
  const baseUrl = "http://192.168.2.102:3000/breweries/";

  beforeEach(() => {
    cy.fixture("localStorage.json").then((snapshot) => {
      cy.visit(baseUrl, {
        onBeforeLoad(win) {
          Object.keys(snapshot).forEach((key) => {
            win.localStorage.setItem(key, snapshot[key]);
          });
        },
      });
    });
  });

  it("renders the brewery table with data", () => {
    cy.get('[data-cy="brewery-table"]').should("exist");

    cy.get('[data-cy="brewery-row"]', { timeout: 10000 }).should(
      "have.length.greaterThan",
      0
    );
  });

  it("filters breweries by selected field and search term", () => {
    cy.get('[data-cy="filter-field"]').click();
    cy.get('[data-cy="filter-field-option-brewery_type"]').click();
    cy.get('[data-cy="filter-input"]').shadow().find('input').type('large');

    cy.get('[data-cy="brewery-row"]', { timeout: 10000 }).each(($row) => {
      cy.wrap($row).should('contain.text', 'large');
    });
  });



  it("clears the filters", () => {
    cy.get('[data-cy="filter-field"]').click();
    cy.get('[data-cy="filter-field-option-city"]').click();
    
    cy.get('[data-cy="filter-input"]').shadow().find('input').type('New York');

    cy.get('[data-cy="clear-filter"]').click();

    cy.get('[data-cy="brewery-row"]', { timeout: 10000 }).should(
      "have.length.greaterThan",
      0
    );
  });

  it("navigates to next page with pagination", () => {
    cy.get('[data-cy="pagination-next"]').click();
    cy.wait(500);
    cy.get('[data-cy="brewery-row"]').should("exist");
  });

});
