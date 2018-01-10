@contacts-interaction-collection @collection
Feature: View collection of interactions for a contact

  @contacts-interactions-collection--view
  Scenario: View companies contact collection

    Given I navigate to contact fixture Dean Cox
    When I click the Interactions local nav link
    Then the results count header for interactions is present
    And I can view the collection

  @contacts-interactions-collection--filter # TODO

  @contacts-interactions-collection--sort # TODO

  @contacts-interactions-collection--lep @lep
  Scenario: Navigate to documents as LEP

    When I navigate directly to /interactions of contact fixture Johnny Cakeman
    Then I see the 403 error page

  @contacts-interactions-collection--da @da
  Scenario: Navigate to documents as DA

    When I navigate directly to /interactions of contact fixture Johnny Cakeman
    Then I see the 403 error page
