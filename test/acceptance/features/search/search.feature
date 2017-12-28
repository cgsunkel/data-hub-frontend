@search
Feature: Search
  As an existing user
  I would like to search the data hub
  So search for entities

  @search--events
  Scenario: Search events

    When I click the Events global nav link
    And I click the "Add event" link
    And I populate the create event form
    And I click the save button
    Then I see the success message
    When I search for the created event
    Then I verify the search tabs are displayed
      | text                |
      | Companies           |
      | Contacts            |
      | Events              |
      | Interactions        |
      | Investment projects |
      | Orders              |
    And the Companies search tab has 0 results
    When the Events search tab is clicked
    Then the Events search tab has 1 results
    And I can view the event in the search results

  @search--companies
  Scenario: Search companies

    Given a "Foreign company" is created
    Then I see the success message
    When I search for the created company
    Then I verify the search tabs are displayed
      | text                |
      | Companies           |
      | Contacts            |
      | Events              |
      | Interactions        |
      | Investment projects |
      | Orders              |
    And the Companies search tab has 1 results
    And I can view the company in the search results
