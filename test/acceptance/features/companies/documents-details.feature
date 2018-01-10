@companies-documents-details @details
Feature: Company documents

  @companies-documents-details--has-documents
  Scenario: Company has documents

    Given I navigate to company fixture Venus Ltd
    When I click the Documents local nav link
    Then view should contain the Documents link

  @companies-documents-details--no-documents
  Scenario: Company does not have documents

    Given I navigate to company fixture Lambda plc
    When I click the Documents local nav link
    Then view should not contain the Documents link

  @companies-documents-details--documents--lep @lep
  Scenario: Navigate to documents as LEP

    When I navigate directly to /documents of company fixture Lambda plc
    Then I see the 403 error page

  @companies-documents-details--documents--da @da
  Scenario: Navigate to documents as DA

    When I navigate directly to /documents of company fixture Lambda plc
    Then I see the 403 error page
